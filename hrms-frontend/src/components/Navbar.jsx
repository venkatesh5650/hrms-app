import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./navbar.css";

const Navbar = () => {
  // Access authenticated user data and logout action from context
  const { user, logout } = useAuth();

  // Programmatic navigation hook
  const navigate = useNavigate();

  // Controls visibility of mobile navigation drawer
  const [isOpen, setIsOpen] = useState(false);

  // Logs out the user and redirects to login page
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Closes mobile navigation menu
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header className="navbar">
        <div className="navbar-left">
          <div className="navbar-brand">
            <div className="brand-logo">HR</div>
            <span>HRMS</span>
          </div>
        </div>

        {/* Primary navigation links for desktop */}
        <nav className="navbar-links">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/employees">Employees</NavLink>
          <NavLink to="/teams">Teams</NavLink>
          <NavLink to="/logs">Logs</NavLink>
        </nav>

        {/* Hamburger icon toggles mobile menu */}
        <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>

        {/* Desktop-only user info and logout */}
        <div className="navbar-right desktop-only">
          {user && (
            <div className="navbar-user">
              <span className="navbar-user-name">{user.name || "Admin"}</span>
              <button className="btn btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile navigation drawer */}
      <div className={`mobile-menu ${isOpen ? "open" : ""}`}>
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

        {/* Mobile user info and logout */}
        {user && (
          <div className="mobile-user">
            <span>{user.name || "Admin"}</span>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Background overlay to close mobile menu when clicking outside */}
      {isOpen && <div className="mobile-overlay" onClick={closeMenu} />}
    </>
  );
};

export default Navbar;
