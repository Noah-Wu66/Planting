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
- **后端**: Next.js App Router（Node.js 22）
- **AI集成**: Gemini 2.5 Flash模型
- **静态资源**: 由 Next.js `public/` 提供
- **单服务部署**: 前后端合并，适合Zeabur等平台

## 快速开始

### 1. 环境准备

确保 Node.js 22。

### 2. 本地开发

```bash
# 安装依赖
npm ci # 或 npm install

# 启动开发
npm run dev

# 构建
npm run build

# 生产启动
npm start
```

服务将由 Next.js 提供，前端脚本通过 `app/page.js` 注入运行。

### 3. 获取Gemini API密钥

1. 访问 [AiHubMix](https://aihubmix.com)
2. 注册账号并获取API密钥
3. 将密钥配置到托管平台环境变量中（如 `GEMINI_API_KEY`）

### 4. Zeabur部署

1. 将代码推送到GitHub仓库
2. 在Zeabur中连接GitHub仓库
3. 设置环境变量 `GEMINI_API_KEY`
4. Zeabur 选择 Node/Next.js 方案并部署（详见 ZEABUR_DEPLOY.md）

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

### Zeabur部署
- 环境变量: 在Zeabur控制台设置 GEMINI_API_KEY（可选 GEMINI_BASE_URL）
- 域名绑定: 支持自定义域名
- 自动HTTPS: Zeabur提供免费SSL证书

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
