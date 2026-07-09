import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getPersonById = (id) => {
  return api.get(`/person/${id}`);
};

export default api;