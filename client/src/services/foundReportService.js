import api from "./api";

export const createFoundReport = (formData) => api.post("/found-report", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const getMyFoundReports = async () => (await api.get("/found-report/my")).data.reports;
export const getPendingFoundReports = async () => (await api.get("/found-report/pending")).data.reports;
export const approveFoundReport = async (id, reviewRemarks = "") => (await api.put(`/found-report/${id}/approve`, { reviewRemarks })).data.report;
export const rejectFoundReport = async (id, reviewRemarks = "") => (await api.put(`/found-report/${id}/reject`, { reviewRemarks })).data.report;
