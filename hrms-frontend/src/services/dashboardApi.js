import api from "./api";

export const fetchDashboardStats = () => api.get("/analytics");
export const fetchPendingApprovals = () => api.get("/approvals/pending");
export const fetchApprovalHistory = () => api.get("/approvals/history");
export const fetchRecentLogs = () => api.get("/logs?limit=5");
export const fetchMyProfile = () => api.get("/profile/me");
