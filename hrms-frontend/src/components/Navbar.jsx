import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header className="navbar">
        <div className="navbar-left">
          <span className="navbar-logo">Evallo HRMS</span>
        </div>

        {/* Desktop Links */}
        <nav className="navbar-links">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/employees">Employees</NavLink>
          <NavLink to="/teams">Teams</NavLink>
          <NavLink to="/logs">Logs</NavLink>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          className="hamburger"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          ☰
        </button>

        {/* Desktop Logout */}
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

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="mobile-menu">
          <NavLink to="/dashboard" onClick={closeMenu}>
            Dashboard
          </NavLink>
          <NavLink to="/employees" onClick={closeMenu}>
            Employees
          </NavLink>
          <NavLink to="/teams" onClick={closeMenu}>
            Teams
          </NavLink>
          <NavLink to="/logs" onClick={closeMenu}>
            Logs
          </NavLink>
          <button className="btn btn-small btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
