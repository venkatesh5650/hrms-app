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
  LogOut,
} from "lucide-react";
import "../../styles/layout/sidebar.css";

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

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const items = SIDEBAR_ITEMS[user?.role] || [];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">HR</div>
        <span>HRMS</span>
      </div>

      <nav className="sidebar-links">
        {items.map((item) => {
          const Icon = ICONS[item.label] || LayoutDashboard;

          return (
            <NavLink key={item.path} to={item.path}>
              <Icon size={18} className="sidebar-icon" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <span className="sidebar-user">{user?.name || user?.role}</span>
        <button className="sidebar-logout" onClick={handleLogout}>
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
