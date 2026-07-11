import api from "./api";

// Get all users
export const getAllUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

// Get pending users
export const getPendingUsers = async () => {
  const response = await api.get("/users/pending");
  return response.data;
};

// Approve a user
export const approveUser = async (id) => {
  const response = await api.put(`/users/${id}/approve`);
  return response.data;
};

// Reject a user
export const rejectUser = async (id) => {
  const response = await api.put(`/users/${id}/reject`);
  return response.data;
};

// Suspend a user
export const suspendUser = async (id) => {
  const response = await api.put(`/users/${id}/suspend`);
  return response.data;
};

// Reactivate a user
export const reactivateUser = async (id) => {
  const response = await api.put(`/users/${id}/reactivate`);
  return response.data;
};

// Delete a user
export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};