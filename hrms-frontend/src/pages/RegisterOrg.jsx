import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RegisterOrg = () => {
  const { registerOrg } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    orgName: "",
    adminName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerOrg(form);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try with a different email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <h2>Create Organisation</h2>
        <p className="auth-subtitle">
          Setup a new organisation and first admin user
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="form">
          <div className="form-row">
            <label>Organisation Name</label>
            <input
              name="orgName"
              value={form.orgName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <label>Admin Name</label>
            <input
              name="adminName"
              value={form.adminName}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label>Admin Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn btn-full" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create & Continue"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterOrg;
