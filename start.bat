@echo off
echo 启动植树问题AI学习平台...
echo.

echo 检查Python环境...
python --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到Python，请先安装Python 3.8+
    pause
    exit /b 1
)

echo 检查API依赖...
cd api
if not exist ".env" (
    echo 警告: 未找到.env文件，请复制.env.example并配置API密钥
    copy .env.example .env
    echo 请编辑 api\.env 文件，设置你的 GEMINI_API_KEY
    pause
)

echo 安装Python依赖...
pip install -r requirements.txt

echo 启动服务...
echo 注意：前后端已合并为单一服务
start "植树问题学习平台" python main.py

cd ..

echo.
echo 服务启动完成！
echo 访问地址: http://localhost:8080
echo API文档: http://localhost:8080/docs
echo.
echo 按任意键退出...
pause >nul
