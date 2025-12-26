import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./login.css";

const Login = () => {
  // Auth function from context to handle login API call & token storage
  const { login } = useAuth();

  // React Router hook to navigate after successful login
  const navigate = useNavigate();

  // Controlled form state for login credentials
  const [form, setForm] = useState({
    email: "demo@gmail.com",
    password: "demo@5650",
  });

  // Error message state for UI feedback
  const [error, setError] = useState("");

  // Loading state to prevent duplicate submissions and show progress
  const [loading, setLoading] = useState(false);

  // Updates form state on input change (generic handler for all fields)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Pre-fills demo credentials for quick testing
  const handleDemoCredentials = () => {
    setForm({
      email: "demo@gmail.com",
      password: "demo@5650",
    });
    setError("");
  };

  // Handles form submission and authentication flow
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Calls login function and waits for authentication to complete
      await login(form);

      // Redirects user to dashboard on success
      navigate("/dashboard");
    } catch (err) {
      // Displays API error message or fallback message
      setError(
        err.response?.data?.message || "Login failed. Please check credentials."
      );
    } finally {
      // Resets loading state regardless of outcome
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
          <h2>Your Central Hub for HR Operations</h2>
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

          {/* Shows authentication errors */}
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

            <button type="submit" className="btn btn-primary">
              {loading ? "Authenticating..." : "Enter System"}
            </button>
          </form>

          <button className="btn btn-secondary" onClick={handleDemoCredentials}>
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
