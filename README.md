# 植树问题AI学习平台

一个面向小学五年级学生的植树问题学习平台，集成了拖拽交互和AI智能辅导功能。

## 功能特点

### 🌳 拖拽交互学习
- **可视化种树**: 拖拽树木到地面线段上
- **自动吸附**: 树木自动吸附到正确的种植点
- **参数调节**: 可调节地面长度、种树间距
- **多种模式**: 支持两端都种、两端都不种、一端种一端不种、环形种树

### 🤖 AI智能辅导
- **实时对话**: 基于Gemini 2.5 Flash的智能对话
- **情境感知**: AI能理解当前的树木摆放情况
- **个性化指导**: 根据学生操作给出针对性建议
- **上下文记忆**: 支持连续对话和新话题切换

### 🎯 练习系统
- **智能题目生成**: 自动生成不同难度的练习题
- **即时反馈**: 实时检查答案正确性
- **解题提示**: 提供分步骤的解题指导

## 技术架构

### 全栈应用
- **前端**: 纯JavaScript，无框架依赖，轻量级实现
- **SVG绘图**: 精确的图形渲染和交互
- **拖拽API**: 原生HTML5拖拽功能
- **后端**: FastAPI + Python，高性能Web框架
- **AI集成**: Gemini 2.5 Flash模型
- **静态文件服务**: FastAPI内置静态文件服务
- **单服务部署**: 前后端合并，适合Zeabur等平台

## 快速开始

### 1. 环境准备

确保已安装Python 3.8+和pip。

### 2. 本地开发

```bash
# 进入API目录
cd api

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，设置你的 GEMINI_API_KEY

# 启动服务（前后端合并）
python main.py
```

服务将在 `http://localhost:8000` 启动，包含前端界面和API。

### 3. 获取Gemini API密钥

1. 访问 [AiHubMix](https://aihubmix.com)
2. 注册账号并获取API密钥
3. 将密钥配置到 `api/.env` 文件中

### 4. Zeabur部署

1. 将代码推送到GitHub仓库
2. 在Zeabur中连接GitHub仓库
3. 设置环境变量 `GEMINI_API_KEY`
4. Zeabur会自动检测Dockerfile并部署

## 使用指南

### 拖拽交互
1. **设置参数**: 调节地面长度、种树间距和种树模式
2. **添加树木**: 点击"添加树木"按钮
3. **拖拽种树**: 将树木拖拽到地面线段上的绿色吸附点
4. **自动吸附**: 树木会自动吸附到最近的种植点

### AI对话
1. **放置树木**: 先在拖拽区域放置一些树木
2. **提出问题**: 在输入框中输入你的问题
3. **获得回答**: AI会根据当前情况给出个性化回答
4. **继续对话**: 可以继续提问或开始新话题

### 控制功能
- **清空重置**: 清除所有树木并重置参数
- **更新地面**: 根据新参数重新生成地面和吸附点
- **继续提问**: 保持对话上下文继续提问
- **新的问题**: 清空对话历史开始新话题

## API文档

### POST /api/chat
与AI进行对话

**请求体**:
```json
{
  "message": "用户问题",
  "interaction_state": {
    "trees": [{"x": 100, "y": 150, "id": "tree-1"}],
    "ground": {"length": 100, "interval": 10, "startX": 50, "startY": 150, "endX": 550},
    "tree_mode": "both"
  },
  "chat_history": [],
  "is_new_conversation": false
}
```

**响应**:
```json
{
  "response": "AI回答内容",
  "updated_history": [...]
}
```

### GET /api/health
健康检查

## 部署说明

### 本地开发
- 单一服务: FastAPI提供前后端服务 (端口8000)
- 静态文件: 通过FastAPI StaticFiles中间件提供

### Zeabur部署
- 自动检测: Zeabur自动识别Dockerfile
- 环境变量: 在Zeabur控制台设置GEMINI_API_KEY
- 域名绑定: 支持自定义域名
- 自动HTTPS: Zeabur提供免费SSL证书

### Docker部署
```bash
# 构建镜像
docker build -t planting-app .

# 运行容器
docker run -p 8000:8000 -e GEMINI_API_KEY=your-key planting-app
```

## 贡献指南

1. Fork本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

如有问题或建议，请通过以下方式联系：
- 提交Issue
- 发送邮件到项目维护者

---

**注意**: 使用前请确保已正确配置Gemini API密钥，否则AI功能将无法正常工作。
