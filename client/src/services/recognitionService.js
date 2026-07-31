import api from "./api";

export const getRecognitionSessions = async () => {
  const { data } = await api.get("/recognitions");
  return data.sessions;
};

export const getRecognitionSession = async (id) => {
  const { data } = await api.get(`/recognitions/${id}`);
  return data.session;
};

export const deleteRecognitionSession = (id) => api.delete(`/recognitions/${id}`);
