"""Face embedding service for GodsEye.

The service is intentionally stateless: Express owns uploads and MongoDB, while
this process only turns supplied images into InsightFace embeddings.
"""

from contextlib import asynccontextmanager
from typing import Annotated
import base64
import json
import os
import tempfile

import cv2
import numpy as np
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from insightface.app import FaceAnalysis


import threading

face_app: FaceAnalysis | None = None
is_loading: bool = False
model_status: str = "not_started"


def load_face_model():
    global face_app, is_loading, model_status
    is_loading = True
    model_status = "downloading_and_initializing"
    print("Starting InsightFace (buffalo_l) background model loading...")
    try:
        app_instance = FaceAnalysis(
            name="buffalo_l",
            providers=["CPUExecutionProvider"],
        )
        app_instance.prepare(ctx_id=0, det_size=(640, 640))
        face_app = app_instance
        model_status = "ready"
        print("InsightFace model (buffalo_l) loaded successfully and is ready.")
    except Exception as e:
        model_status = f"error: {e}"
        print(f"Error loading InsightFace model: {e}")
    finally:
        is_loading = False


@asynccontextmanager
async def lifespan(_: FastAPI):
    thread = threading.Thread(target=load_face_model, daemon=True)
    thread.start()
    yield


app = FastAPI(title="GodsEye Face AI", version="1.0.0", lifespan=lifespan)

@app.get("/")
def root():
    return {
        "status": "GodsEye AI Service Running",
        "ready": face_app is not None,
        "modelStatus": model_status,
    }

@app.get("/health")
def health():
    return {
        "success": True,
        "service": "GodsEye Face AI",
        "ready": face_app is not None,
        "modelStatus": model_status,
    }


def decode_image(payload: bytes) -> np.ndarray:
    image = cv2.imdecode(np.frombuffer(payload, dtype=np.uint8), cv2.IMREAD_COLOR)
    if image is None:
        raise HTTPException(status_code=400, detail="One of the uploads is not a readable image.")
    return image


def serialize_faces(image: np.ndarray) -> list[dict]:
    """Detect every face and return normalized embeddings plus display metadata."""
    if face_app is None:
        raise HTTPException(status_code=503, detail="Face model is still loading.")

    faces = face_app.get(image)
    serialized_faces = []
    for face in faces:
        embedding = np.asarray(face.embedding, dtype=np.float32)
        norm = float(np.linalg.norm(embedding))
        if norm == 0:
            continue

        x1, y1, x2, y2 = face.bbox.astype(float).tolist()
        serialized_faces.append(
            {
                "embedding": (embedding / norm).tolist(),
                "boundingBox": {"x": x1, "y": y1, "width": x2 - x1, "height": y2 - y1},
                "detectionScore": float(face.det_score),
            }
        )
    return serialized_faces


def cosine_similarity(left: np.ndarray, right: np.ndarray) -> float:
    left_norm = float(np.linalg.norm(left))
    right_norm = float(np.linalg.norm(right))
    if left_norm == 0 or right_norm == 0 or left.shape != right.shape:
        return -1.0
    return float(np.dot(left, right) / (left_norm * right_norm))


def best_match(embedding: list[float], persons: list[dict]) -> tuple[dict | None, float]:
    probe = np.asarray(embedding, dtype=np.float32)
    winner, highest = None, -1.0
    for person in persons:
        for stored_embedding in person.get("embeddings", []):
            similarity = cosine_similarity(probe, np.asarray(stored_embedding, dtype=np.float32))
            if similarity > highest:
                winner, highest = person, similarity
    return winner, highest


def annotated_preview_base64(
    frame: np.ndarray,
    bounding_box: dict,
    similarity: float,
    timestamp: float,
    frame_number: int,
) -> str:
    """Draw match metadata before the preview leaves the AI service."""
    preview = frame.copy()
    x = max(0, int(bounding_box["x"]))
    y = max(0, int(bounding_box["y"]))
    width = max(0, int(bounding_box["width"]))
    height = max(0, int(bounding_box["height"]))
    green = (0, 255, 0)

    cv2.rectangle(preview, (x, y), (x + width, y + height), green, 3)
    label_y = max(24, y - 10)
    cv2.putText(
        preview,
        f"{similarity * 100:.1f}%",
        (x, label_y),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        green,
        2,
        cv2.LINE_AA,
    )
    cv2.putText(
        preview,
        f"Time: {timestamp:.2f}s | Frame: {frame_number}",
        (16, 30),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        green,
        2,
        cv2.LINE_AA,
    )

    encoded, buffer = cv2.imencode(".jpg", preview, [cv2.IMWRITE_JPEG_QUALITY, 85])
    if not encoded:
        raise HTTPException(status_code=500, detail="Could not create the matched-frame preview.")
    return base64.b64encode(buffer.tobytes()).decode("ascii")


@app.post("/embeddings")
async def embeddings(images: Annotated[list[UploadFile], File(...)]) -> dict:
    """Return every face found in every supplied image.

    Embeddings are L2-normalized here, making their dot product equivalent to
    cosine similarity in the Express recognition layer.
    """
    if face_app is None:
        raise HTTPException(status_code=503, detail="Face model is still loading.")

    results = []
    for source_index, upload in enumerate(images):
        image = decode_image(await upload.read())
        serialized_faces = serialize_faces(image)

        results.append(
            {
                "sourceIndex": source_index,
                "filename": upload.filename,
                "faces": serialized_faces,
            }
        )

    return {"success": True, "images": results}


@app.post("/video/recognize")
async def recognize_video(
    video: Annotated[UploadFile, File(...)],
    persons_json: Annotated[str, Form(...)],
    frame_interval: Annotated[int, Form()] = 5,
    threshold: Annotated[float, Form()] = 0.45,
) -> dict:
    """Process every Nth CCTV frame and return only above-threshold matches.

    Registered MongoDB embeddings are supplied by Express for this request, so
    the AI service remains stateless and never owns application data.
    """
    if face_app is None:
        raise HTTPException(status_code=503, detail="Face model is still loading.")
    if frame_interval < 1 or frame_interval > 300:
        raise HTTPException(status_code=400, detail="Frame interval must be between 1 and 300.")

    try:
        persons = json.loads(persons_json)
    except json.JSONDecodeError as error:
        raise HTTPException(status_code=400, detail="Registered face data is invalid.") from error
    if not isinstance(persons, list):
        raise HTTPException(status_code=400, detail="Registered face data must be a list.")

    suffix = os.path.splitext(video.filename or "video.mp4")[1].lower() or ".mp4"
    temporary_path = ""
    capture = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temporary_file:
            temporary_path = temporary_file.name
            temporary_file.write(await video.read())

        capture = cv2.VideoCapture(temporary_path)
        if not capture.isOpened():
            raise HTTPException(status_code=400, detail="The uploaded video could not be opened.")

        total_frames = int(capture.get(cv2.CAP_PROP_FRAME_COUNT))
        video_fps = float(capture.get(cv2.CAP_PROP_FPS)) or 30.0
        processed_frames = 0
        total_faces_detected = 0
        matches = []
        last_seen_match = None
        frame_number = 0

        while True:
            success, frame = capture.read()
            if not success:
                break

            if frame_number % frame_interval == 0:
                processed_frames += 1
                faces = serialize_faces(frame)
                total_faces_detected += len(faces)
                for face_index, face in enumerate(faces):
                    person, similarity = best_match(face["embedding"], persons)
                    if person is not None and similarity >= threshold:
                        candidate = {
                            "personId": person["id"],
                            "similarity": similarity,
                            "timestamp": frame_number / video_fps,
                            "frameNumber": frame_number,
                            "faceIndex": face_index,
                            "boundingBox": face["boundingBox"],
                            "previewImageBase64": annotated_preview_base64(
                                frame,
                                face["boundingBox"],
                                similarity,
                                frame_number / video_fps,
                                frame_number,
                            ),
                        }
                        # This is deliberately independent of the top-three score list:
                        # history must retain the latest sighting in the footage.
                        if last_seen_match is None or candidate["timestamp"] >= last_seen_match["timestamp"]:
                            last_seen_match = candidate

                        lowest_similarity = min(
                            (candidate["similarity"] for candidate in matches),
                            default=-1.0,
                        )
                        if len(matches) >= 3 and similarity <= lowest_similarity:
                            continue

                        matches.append(candidate)
                        matches.sort(key=lambda candidate: candidate["similarity"], reverse=True)
                        del matches[3:]
            frame_number += 1

        return {
            "success": True,
            "totalFrames": total_frames or frame_number,
            "processedFrames": processed_frames,
            "totalFacesDetected": total_faces_detected,
            "matches": sorted(matches, key=lambda candidate: candidate["similarity"], reverse=True),
            "lastSeenMatch": last_seen_match,
        }
    finally:
        if capture is not None:
            capture.release()
        if temporary_path and os.path.exists(temporary_path):
            os.unlink(temporary_path)
