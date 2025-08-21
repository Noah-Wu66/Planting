#!/bin/bash

echo "启动植树问题AI学习平台..."
echo

# 检查Python环境
if ! command -v python3 &> /dev/null; then
    echo "错误: 未找到Python3，请先安装Python 3.8+"
    exit 1
fi

echo "检查API依赖..."
cd api

# 检查.env文件
if [ ! -f ".env" ]; then
    echo "警告: 未找到.env文件，请复制.env.example并配置API密钥"
    cp .env.example .env
    echo "请编辑 api/.env 文件，设置你的 GEMINI_API_KEY"
    read -p "按Enter继续..."
fi

echo "安装Python依赖..."
pip3 install -r requirements.txt

echo "启动后端服务..."
python3 main.py &
API_PID=$!

cd ..
echo "等待后端服务启动..."
sleep 3

echo "启动前端服务..."
python3 -m http.server 3000 &
FRONTEND_PID=$!

echo
echo "服务启动完成！"
echo "前端地址: http://localhost:3000"
echo "后端地址: http://localhost:8000"
echo "API文档: http://localhost:8000/docs"
echo
echo "按Ctrl+C停止服务..."

# 等待用户中断
trap "echo '正在停止服务...'; kill $API_PID $FRONTEND_PID; exit" INT
wait
