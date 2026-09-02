# PhishGuard - 100% Free & Open Source Multi-Stage Dockerfile
FROM python:3.10-slim AS backend

WORKDIR /app

# Prevent Python from writing .pyc files & enable unbuffered logs
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python free packages
COPY app/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend and ML source code
COPY app/ ./app/
COPY ml/ ./ml/

# Create SQLite storage directory
RUN mkdir -p /app/data

# Train model if not present during build
RUN python ml/train.py

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
