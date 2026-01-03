import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const RAW_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "https://hrms-backend-dw0e.onrender.com/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("hrms_token");
    const storedUserRaw = localStorage.getItem("hrms_user");

    if (storedToken && storedUserRaw && storedUserRaw !== "undefined") {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUserRaw));
      } catch {
        localStorage.removeItem("hrms_user");
        localStorage.removeItem("hrms_token");
      }
    }

    setLoading(false);
  }, []);

  const handleAuthSuccess = (data) => {
    if (!data || !data.token || !data.user) {
      console.error("Invalid auth response:", data);
      return;
    }

    const { token, user } = data;
    setToken(token);
    setUser(user);
    localStorage.setItem("hrms_token", token);
    localStorage.setItem("hrms_user", JSON.stringify(user));
  };

  const login = async (payload) => {
    const res = await axios.post(`${RAW_BASE_URL}/auth/login`, payload);
    console.log("LOGIN RESPONSE:", res.data);
    handleAuthSuccess(res.data);
  };

  const registerOrg = async (payload) => {
    const res = await axios.post(`${RAW_BASE_URL}/auth/register`, payload);
    handleAuthSuccess(res.data);
  };

  const logout = async () => {
    try {
      if (token) {
        await axios.post(
          `${RAW_BASE_URL}/auth/logout`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch {}
    setToken(null);
    setUser(null);
    localStorage.removeItem("hrms_token");
    localStorage.removeItem("hrms_user");
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    registerOrg,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
