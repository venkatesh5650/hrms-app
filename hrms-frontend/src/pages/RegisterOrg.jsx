import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./registerOrg.css";

const RegisterOrg = () => {
  // Auth function to register organisation + admin user
  const { registerOrg } = useAuth();

  // Used to redirect user after successful registration
  const navigate = useNavigate();

  // Controlled form state for organisation and admin details
  const [form, setForm] = useState({
    orgName: "",
    adminName: "",
    email: "",
    password: "",
  });

  // Error message state for UI feedback
  const [error, setError] = useState("");

  // Loading state to prevent duplicate submissions
  const [loading, setLoading] = useState(false);

  // Generic change handler for all form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Handles form submission and registration flow
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Registers organisation and creates first admin user
      await registerOrg(form);

      // Redirects to dashboard on success
      navigate("/login");
    } catch (err) {
      // Displays API error or fallback message
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try with a different email."
      );
    } finally {
      // Resets loading state after request completes
      setLoading(false);
    }
  };

  return (
    <div className="register-root">
      <div className="register-card">
        <h2 className="title">Create Organisation</h2>
        <p className="subtitle">
          Setup a new organisation and first admin user
        </p>

        {/* Displays registration error if present */}
        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>Organisation Name</label>
          <input
            name="orgName"
            value={form.orgName}
            onChange={handleChange}
            required
          />

          <label>Admin Name</label>
          <input
            name="adminName"
            value={form.adminName}
            onChange={handleChange}
          />

          <label>Admin Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create & Continue"}
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
