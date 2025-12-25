import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./login.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "demo@gmail.com", // ⭐ Default email
    password: "demo@5650", // ⭐ Default password
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleDemoCredentials = () => {
    setForm({
      email: "demo@gmail.com",
      password: "demo@5650",
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please check credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-left">
        <img
          src="https://res.cloudinary.com/dpiu7mohv/image/upload/v1766676863/portrait-professional-business-people-working-together_oe5u7s.jpg"
          alt="Professional team"
        />
        <div className="login-overlay" />
        <div className="login-left-text">
          <h2>Future-ready HR Platform</h2>
          <p>Manage people. Build teams. Scale securely.</p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="brand">
            <div className="brand-logo">HR</div>
            <span>HRMS</span>
          </div>

          <h2 className="title">Access Portal</h2>
          <p className="subtitle">Secure login to continue</p>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />

            <button type="submit">
              {loading ? "Authenticating..." : "Enter System"}
            </button>
          </form>

          <button className="demo-btn" onClick={handleDemoCredentials}>
            Use Demo Account
          </button>

          <div className="footer">
            <span>New organisation?</span>
            <Link to="/register">Create access</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
