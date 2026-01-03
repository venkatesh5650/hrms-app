import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/pages/organisationSignup.css";

const RegisterOrg = () => {
  const { registerOrg } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    orgName: "",
    adminName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value.trimStart() }));
  };

  const isValid =
    form.orgName.length >= 3 &&
    form.email.includes("@") &&
    form.password.length >= 6 &&
    !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerOrg(form);
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please use a different email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-root">
      <div className="register-card">
        <h2 className="title">Create Organisation</h2>
        <p className="subtitle">
          Setup your company and assign the first administrator
        </p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>Organisation Name</label>
          <input
            name="orgName"
            value={form.orgName}
            onChange={handleChange}
            placeholder="Enter Your Organisation Name"
            required
          />

          <label>Admin Name</label>
          <input
            name="adminName"
            value={form.adminName}
            onChange={handleChange}
            placeholder="Enter Your Admin Name"
          />

          <label>Admin Email</label>
          <input
            type="email"
            name="email"
            autoComplete="username"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter Your Admin Email"
            required
          />

          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="new-password"
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

          <button className="btn btn-primary" type="submit" disabled={!isValid}>
            {loading ? "Creating..." : "Create Organisation"}
          </button>
        </form>

        <div className="footer">
          <span>Already have an account?</span>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterOrg;
