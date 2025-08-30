# Zeabur 部署指南（Next.js）

项目已迁移为 Next.js App Router（Node.js 22）。

运行与部署配置：

- 运行时：Node.js 22
- 安装命令：npm ci（无锁则使用 npm install）
- 构建命令：npm run build
- 启动命令：npm start
- 环境变量：
  - GEMINI_API_KEY=sk-your-api-key-here
  - 可选 GEMINI_BASE_URL（缺省为 `https://aihubmix.com/gemini`）

服务路径：
- 前端入口：Next.js 在 `app/` 渲染
- 静态资源：`public/assets/*`
- 后端 API：`/api/*` 由 App Router Route Handlers 提供

备注：原 Python/FastAPI 与 Docker 部署方式已移除。
