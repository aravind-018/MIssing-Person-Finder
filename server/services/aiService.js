import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const AI_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

export const checkAI = async () => {
  const { data } = await axios.get(`${AI_URL}/health`, { timeout: 5000 });
  return data;
};

export const extractFaces = async (imagePaths) => {
  try {
    const form = new FormData();

    imagePaths.forEach((imagePath) => {
      form.append("images", fs.createReadStream(imagePath));
    });

    const endpoint = `${AI_URL}/embeddings`;
    console.log("AI endpoint:", endpoint);
    console.log("AI image paths:", imagePaths);

    const { data } = await axios.post(endpoint, form, {
      headers: form.getHeaders(),
      timeout: 60000,
    });

    console.log("AI Response:", data);

    if (!Array.isArray(data?.images)) {
      const error = new Error("AI service returned an invalid response: expected an images array.");
      error.statusCode = 502;
      throw error;
    }

    return data.images;
  } catch (error) {
    console.error("========== ERROR ==========");
    console.error(error);

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Response:", error.response.data);
    }

    console.error(error.stack);

    throw error;
  }
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
