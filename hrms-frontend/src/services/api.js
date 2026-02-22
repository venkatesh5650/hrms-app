import axios from "axios";

// Use .env if available, else fall back to deployed backend
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "https://hrms-backend-dw0e.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach token automatically from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("hrms_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response handler
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const data = error?.response?.data;

    // For 403, we let the component handle it locally via openPermissionModal
    // For general errors, we dispatch a global toast event instead of native alert
    if (error?.response?.status !== 403 && data?.code !== "DEMO_ACCOUNT_READ_ONLY") {
      const msg = data?.message || "Something went wrong. Please try again.";
      // Optional: Dispatch to a global toast if one exists, but strictly no alerts.
      window.dispatchEvent(new CustomEvent("show-toast", { detail: msg }));
    }

    return Promise.reject(error);
  }
);

export default api;
