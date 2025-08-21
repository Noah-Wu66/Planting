from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
from pathlib import Path
from google import genai
from google.genai import types
import json

app = FastAPI(title="植树问题AI学习平台", version="1.0.0")

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Zeabur部署时允许所有来源
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 挂载静态文件
static_dir = Path(__file__).parent / "static"
if static_dir.exists():
    app.mount("/assets", StaticFiles(directory=static_dir / "assets"), name="assets")
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

# 初始化Gemini客户端
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "sk-your-api-key-here")
client = genai.Client(
    api_key=GEMINI_API_KEY,
    http_options={"base_url": "https://aihubmix.com/gemini"},
)

# 数据模型
class TreePosition(BaseModel):
    x: float
    y: float
    id: str

class GroundConfig(BaseModel):
    length: float
    interval: float
    start_x: float
    start_y: float

class InteractionState(BaseModel):
    trees: List[TreePosition]
    ground: GroundConfig
    tree_mode: str  # 'both', 'none', 'one', 'circle'

class ChatMessage(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    message: str
    interaction_state: InteractionState
    chat_history: List[ChatMessage] = []
    is_new_conversation: bool = False

class ChatResponse(BaseModel):
    response: str
    updated_history: List[ChatMessage]

# 存储会话状态（生产环境建议使用Redis等）
sessions: Dict[str, List[ChatMessage]] = {}

def generate_system_prompt(interaction_state: InteractionState) -> str:
    """根据当前交互状态生成系统提示"""
    trees = interaction_state.trees
    ground = interaction_state.ground
    mode = interaction_state.tree_mode
    
    # 计算树木间距
    tree_positions = sorted([tree.x for tree in trees])
    intervals = []
    if len(tree_positions) > 1:
        for i in range(1, len(tree_positions)):
            intervals.append(tree_positions[i] - tree_positions[i-1])
    
    # 分析种树模式
    mode_descriptions = {
        'both': '两端都种树',
        'none': '两端都不种',
        'one': '一端种，一端不种',
        'circle': '环形（圆形）种树'
    }
    
    prompt = f"""你是一个专门教授小学五年级植树问题的AI助手。

当前学习场景：
- 地面总长度：{ground.length}米
- 设定的种树间距：{ground.interval}米
- 种树模式：{mode_descriptions.get(mode, mode)}
- 当前摆放的树木数量：{len(trees)}棵
- 树木位置：{[f"({tree.x:.1f}, {tree.y:.1f})" for tree in trees]}

如果有多棵树，实际间距为：{intervals if intervals else "无"}

请根据学生的摆放情况和提问，用温和、鼓励的语气回答问题。重点关注：
1. 帮助学生理解间距、路长、树棵数的关系
2. 分析当前摆放是否符合题目要求
3. 引导学生思考不同种树模式的区别
4. 用简单易懂的语言解释数学概念

回答要简洁明了，适合五年级学生理解。"""
    
    return prompt

@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    """与AI进行对话"""
    try:
        # 生成系统提示
        system_prompt = generate_system_prompt(request.interaction_state)
        
        # 构建对话内容
        contents = [
            types.Content(
                role="user",
                parts=[types.Part.from_text(text=system_prompt)]
            )
        ]
        
        # 如果不是新对话，添加历史记录
        if not request.is_new_conversation and request.chat_history:
            for msg in request.chat_history:
                contents.append(
                    types.Content(
                        role=msg.role,
                        parts=[types.Part.from_text(text=msg.content)]
                    )
                )
        
        # 添加当前用户消息
        contents.append(
            types.Content(
                role="user",
                parts=[types.Part.from_text(text=request.message)]
            )
        )
        
        # 调用Gemini API
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=contents,
        )
        
        # 更新对话历史
        updated_history = request.chat_history.copy() if not request.is_new_conversation else []
        updated_history.append(ChatMessage(role="user", content=request.message))
        updated_history.append(ChatMessage(role="assistant", content=response.text))
        
        return ChatResponse(
            response=response.text,
            updated_history=updated_history
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI服务错误: {str(e)}")

@app.get("/api/health")
async def health_check():
    """健康检查"""
    return {"status": "healthy", "message": "植树问题AI学习平台运行正常"}

# 前端路由处理
@app.get("/")
async def read_index():
    """返回主页"""
    index_file = static_dir / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return {"message": "植树问题AI学习平台", "status": "running"}

@app.get("/{full_path:path}")
async def catch_all(full_path: str):
    """捕获所有前端路由，返回index.html用于SPA"""
    # 如果是API路径，返回404
    if full_path.startswith("api/"):
        raise HTTPException(status_code=404, detail="API endpoint not found")

    # 检查是否是静态文件
    static_file = static_dir / full_path
    if static_file.exists() and static_file.is_file():
        return FileResponse(static_file)

    # 否则返回index.html（SPA路由）
    index_file = static_dir / "index.html"
    if index_file.exists():
        return FileResponse(index_file)

    return {"message": "植树问题AI学习平台", "status": "running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
