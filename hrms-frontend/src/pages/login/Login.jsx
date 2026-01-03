import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/pages/login.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value.trimStart() }));
  };

  const isValid =
    form.email.includes("@") && form.password.length >= 6 && !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      navigate("/dashboard");
    } catch {
      setError("Invalid credentials. Please try again.");
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
          <p className="subtitle">Secure sign-in for authorised users</p>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              autoComplete="username"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter Your Email"
              required
            />

            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter Your Password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={!isValid}
            >
              {loading ? "Authenticating..." : "Enter System"}
            </button>
          </form>

          <div className="footer">
            <span>New organisation?</span>
            <Link to="/register">Request access</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
