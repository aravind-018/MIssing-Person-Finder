import api from "./api";

export const recognizeVideo = (data) =>
  api.post("/ai/video/detect", data);
