import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <span className="navbar-logo">Evallo HRMS</span>
      </div>
      <nav className="navbar-links">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/employees">Employees</NavLink>
        <NavLink to="/teams">Teams</NavLink>
        <NavLink to="/logs">Logs</NavLink>
      </nav>
      <div className="navbar-right">
        {user && (
          <div className="navbar-user">
            <span className="navbar-user-name">{user.name || "Admin"}</span>
            <button className="btn btn-outline" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
