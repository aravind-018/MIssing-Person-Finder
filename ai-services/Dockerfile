FROM python:3.13-slim

# Install system dependencies required for OpenCV and InsightFace
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Keep memory usage low on small instances (Render free tier = 512 MB)
ENV MALLOC_ARENA_MAX=2 \
    OMP_NUM_THREADS=1 \
    PYTHONUNBUFFERED=1

# Copy requirements and install Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download the InsightFace lightweight model pack into the image during build
RUN python -c "from insightface.utils import ensure_available; print(ensure_available('models', 'buffalo_s', root='~/.insightface'))"

# Copy application source code
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Run FastAPI app with Uvicorn (reads $PORT dynamically from Render, falls back to 8000)
CMD sh -c "uvicorn app:app --host 0.0.0.0 --port ${PORT:-8000}"
