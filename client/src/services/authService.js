import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password,
  });

  return response.data;
};

export const registerOfficer = async (officerData) => {
  const response = await axios.post(`${API_URL}/register`, officerData);

  return response.data;
};