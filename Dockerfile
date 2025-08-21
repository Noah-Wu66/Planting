FROM python:3.11-slim

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# 升级pip
RUN pip install --upgrade pip

# 复制并安装Python依赖
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制后端应用代码
COPY api/ .

# 复制前端静态文件到static目录
COPY assets ./static/assets
COPY index.html ./static/
COPY README.md ./static/

# 暴露端口（Zeabur会自动检测）
EXPOSE 8000

# 启动命令
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
