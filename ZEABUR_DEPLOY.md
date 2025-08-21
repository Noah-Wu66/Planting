# Zeabur 部署指南

本文档详细说明如何将植树问题AI学习平台部署到Zeabur。

## 准备工作

### 1. 获取Gemini API密钥
1. 访问 [AiHubMix](https://aihubmix.com)
2. 注册账号并获取API密钥
3. 记录下你的API密钥（格式：`sk-xxx...`）

### 2. 准备GitHub仓库
1. 将项目代码推送到GitHub仓库
2. 确保仓库包含以下文件：
   - `Dockerfile`（项目根目录）
   - `api/requirements.txt`
   - `api/main.py`
   - `assets/` 目录
   - `index.html`

## 部署步骤

### 1. 登录Zeabur
1. 访问 [Zeabur](https://zeabur.com)
2. 使用GitHub账号登录

### 2. 创建项目
1. 点击 "Create Project"
2. 选择合适的区域（推荐：Hong Kong）
3. 输入项目名称：`planting-ai-learning`

### 3. 添加服务
1. 在项目中点击 "Add Service"
2. 选择 "Git Repository"
3. 选择你的GitHub仓库
4. 选择分支（通常是 `main` 或 `master`）

### 4. 配置环境变量
1. 在服务设置中找到 "Environment Variables"
2. 添加以下环境变量：
   ```
   GEMINI_API_KEY=sk-your-api-key-here
   ```
3. 保存设置

### 5. 部署配置
Zeabur会自动检测到Dockerfile并进行部署：
- **构建时间**: 通常需要2-5分钟
- **端口**: 自动检测8000端口
- **域名**: 自动分配.zeabur.app域名

### 6. 访问应用
1. 部署完成后，点击生成的域名
2. 应该能看到植树问题学习平台首页
3. 测试AI对话功能是否正常

## 自定义域名（可选）

### 1. 添加自定义域名
1. 在服务设置中找到 "Domains"
2. 点击 "Add Domain"
3. 输入你的域名（如：`planting.yourdomain.com`）

### 2. 配置DNS
1. 在你的域名提供商处添加CNAME记录
2. 指向Zeabur提供的目标地址
3. 等待DNS生效（通常几分钟到几小时）

### 3. SSL证书
Zeabur会自动为自定义域名申请Let's Encrypt SSL证书。

## 监控和维护

### 1. 查看日志
1. 在服务页面点击 "Logs"
2. 可以查看应用运行日志和错误信息

### 2. 重新部署
1. 推送新代码到GitHub
2. Zeabur会自动触发重新部署
3. 或者在控制台手动触发部署

### 3. 扩容（付费功能）
1. 在服务设置中调整资源配置
2. 可以增加CPU和内存
3. 支持水平扩展

## 故障排除

### 1. 部署失败
- 检查Dockerfile语法
- 确保requirements.txt中的依赖正确
- 查看构建日志中的错误信息

### 2. API调用失败
- 检查GEMINI_API_KEY是否正确设置
- 确认API密钥有效且有足够额度
- 查看应用日志中的错误信息

### 3. 静态文件404
- 确保assets目录和index.html已正确复制
- 检查FastAPI静态文件配置
- 验证文件路径是否正确

### 4. 性能问题
- 检查Zeabur资源使用情况
- 考虑升级到更高配置
- 优化代码和数据库查询

## 成本估算

### 免费额度
- 每月免费使用时间
- 适合开发和小规模使用

### 付费计划
- 按使用量计费
- 支持更高性能和更多功能
- 详见Zeabur官网定价

## 技术支持

如果遇到部署问题：
1. 查看Zeabur官方文档
2. 在GitHub仓库提交Issue
3. 联系Zeabur技术支持

---

**注意**: 确保在部署前测试所有功能，特别是AI对话功能需要有效的API密钥。
