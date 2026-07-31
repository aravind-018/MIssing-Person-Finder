import api from "./api";

export const recognizeVideo = (data) =>
  api.post("/ai/video/detect", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
