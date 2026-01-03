import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { SIDEBAR_ITEMS } from "./SidebarConfig";
import {
  LayoutDashboard,
  CheckCircle,
  Users,
  Layers,
  Shield,
  FileText,
  Download,
  User,
} from "lucide-react";
import "../../styles/layout/navbar.css";

const ICONS = {
  Dashboard: LayoutDashboard,
  Approvals: CheckCircle,
  Employees: Users,
  Teams: Layers,
  Users: Shield,
  Logs: FileText,
  Exports: Download,
  "My Profile": User,
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const closeMenu = () => setIsOpen(false);
  const navItems = SIDEBAR_ITEMS[user?.role] || [];

  return (
    <>
      <header className="navbar">
        <div className="navbar-left">
          <div className="navbar-brand">
            <div className="brand-logo">HR</div>
            <span>HRMS</span>
          </div>
        </div>

        <button className="hamburger" onClick={() => setIsOpen((o) => !o)}>
          ☰
        </button>

        <div className="navbar-right desktop-only">
          {user && (
            <div className="navbar-user">
              <span className="navbar-user-name">{user.name || user.role}</span>
              <button className="btn btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <div className={`mobile-menu ${isOpen ? "open" : ""}`}>
        {navItems.map((item) => {
          const Icon = ICONS[item.label];

          return (
            <NavLink key={item.path} to={item.path} onClick={closeMenu}>
              {Icon && <Icon size={16} className="mobile-icon" />}
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        {user && (
          <div className="mobile-user">
            <span className="userName">{user.name || user.role}</span>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
