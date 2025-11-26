import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("admin@company.com");
  const [password, setPassword] = useState("Admin@123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Admin Login</h2>
      <p style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
        Use the seeded admin credentials or your own.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <p style={{ color: "#f97373", marginBottom: "0.75rem" }}>{error}</p>
        )}
        <button className="button" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
