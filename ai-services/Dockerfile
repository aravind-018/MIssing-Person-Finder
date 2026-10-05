FROM python:3.10-slim

# Install system dependencies required for OpenCV and InsightFace
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download and bake InsightFace lightweight models into the image during build
RUN python -c "from insightface.app import FaceAnalysis; app = FaceAnalysis(name='buffalo_s', providers=['CPUExecutionProvider']); app.prepare(ctx_id=-1, det_size=(640, 640))"

# Copy application source code
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Run FastAPI app with Uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
