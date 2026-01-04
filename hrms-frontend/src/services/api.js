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

// Global response handler for demo + errors
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const data = error?.response?.data;

    if (data?.code === "DEMO_READ_ONLY") {
      alert(
        "🔒 Demo Mode\n\nThis account is read-only.\nSign up or contact admin for full access."
      );
    } else if (data?.message) {
      alert(data.message);
    } else {
      alert("Something went wrong. Please try again.");
    }

    return Promise.reject(error);
  }
);

export default api;
