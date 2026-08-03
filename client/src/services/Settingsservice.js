import api from "./api";

// Get all system settings
export const getSettings = async () => {
  const response = await api.get("/settings");
  return response.data;
};

// Update General settings
export const updateGeneralSettings = async (data) => {
  const response = await api.put("/settings/general", data);
  return response.data;
};

// Update AI settings
export const updateAISettings = async (data) => {
  const response = await api.put("/settings/ai", data);
  return response.data;
};

// Update Camera settings
export const updateCameraSettings = async (data) => {
  const response = await api.put("/settings/camera", data);
  return response.data;
};

// Update Notification settings
export const updateNotificationSettings = async (data) => {
  const response = await api.put("/settings/notifications", data);
  return response.data;
};

// Update Security settings
export const updateSecuritySettings = async (data) => {
  const response = await api.put("/settings/security", data);
  return response.data;
};

// Update Backup settings
export const updateBackupSettings = async (data) => {
  const response = await api.put("/settings/backup", data);
  return response.data;
};

// Get live system info (server / database / AI service / counts)
export const getSystemInfo = async () => {
  const response = await api.get("/settings/system-info");
  return response.data;
};

// Get recent activity, aggregated from real records
export const getActivityLogs = async (limit = 50) => {
  const response = await api.get("/settings/activity-logs", {
    params: { limit },
  });
  return response.data;
};

// Download a full JSON backup of the system's data
export const downloadBackup = async () => {
  const response = await api.get("/settings/backup/export", {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", `godseye-backup-${Date.now()}.json`);

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
};