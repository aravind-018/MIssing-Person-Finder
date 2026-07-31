import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const AI_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

export const checkAI = async () => {
  const { data } = await axios.get(`${AI_URL}/health`, { timeout: 5000 });
  return data;
};

export const extractFaces = async (imagePaths) => {
  const form = new FormData();
  imagePaths.forEach((imagePath) => {
    form.append("images", fs.createReadStream(imagePath));
  });

  const { data } = await axios.post(`${AI_URL}/embeddings`, form, {
    headers: form.getHeaders(),
    timeout: 60000,
  });

  return data.images;
};

export const recognizeVideo = async (videoPath, persons, frameInterval) => {
  const form = new FormData();
  form.append("video", fs.createReadStream(videoPath));
  form.append("persons_json", JSON.stringify(persons));
  form.append("frame_interval", String(frameInterval));
  form.append("threshold", String(process.env.FACE_MATCH_THRESHOLD || 0.45));

  const { data } = await axios.post(`${AI_URL}/video/recognize`, form, {
    headers: form.getHeaders(),
    // Video analysis can take longer than image recognition, especially on CPU.
    timeout: 30 * 60 * 1000,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });

  return data;
};
