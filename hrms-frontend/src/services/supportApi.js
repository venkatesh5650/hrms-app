import api from "./api";

/**
 * Employee submits a support request.
 * Category is automatically routed to HR / MANAGER / ADMIN by the backend.
 */
export const createSupportRequest = (data) =>
    api.post("/support/create", data);

/**
 * HR / Manager / Admin fetches their role-scoped support requests.
 */
export const fetchRoleSupportRequests = () =>
    api.get("/support/role-requests");

/**
 * HR / Manager / Admin resolves a support request by ID.
 */
export const resolveSupportRequest = (id) =>
    api.put(`/support/${id}/resolve`);
