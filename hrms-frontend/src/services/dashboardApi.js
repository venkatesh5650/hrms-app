import api from "./api";

export const fetchDashboardStats = () => api.get("/analytics");
export const fetchPendingApprovals = () => api.get("/approvals/pending");
export const fetchApprovalHistory = () => api.get("/approvals/history");
export const fetchAdminActivity = () => api.get("/logs/activity-feed?scope=admin");
export const fetchHrActivity = () => api.get("/logs/activity-feed?scope=hr");
export const fetchMyProfile = () => api.get("/profile/me");
export const fetchAdminOverview = () => api.get("/analytics/admin-overview");
