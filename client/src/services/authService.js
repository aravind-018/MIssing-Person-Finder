import api from "./api";

export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

export const registerOfficer = async (officerData) => {
  const response = await api.post("/auth/register", officerData);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.put("/auth/change-password", passwordData);
  return response.data;
};

export const updatePreferences = async (preferences) => {
  const response = await api.put("/auth/preferences", preferences);
  return response.data;
};