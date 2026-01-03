import { useAuth } from "../../context/AuthContext";

import AdminDashboard from "../../dashboards/AdminDashboard";
import ManagerDashboard from "../../dashboards/ManagerDashboard";
import HrDashboard from "../../dashboards/HrDashboard";
import EmployeeDashboard from "../../dashboards/EmployeeDashboard";

import "../../styles/base/base.css";
import "../../styles/layout/layout.css";
import "../../styles/pages/approvalWorkflow.css";
import "../../styles/pages/activityFeed.css";
import "../../styles/base/responsive.css";

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) return <div className="dashboard">Loading...</div>;
  if (!user) return <div className="dashboard">Not authenticated</div>;

  switch (user.role) {
    case "ADMIN":
      return <AdminDashboard />;
    case "MANAGER":
      return <ManagerDashboard />;
    case "HR":
      return <HrDashboard />;
    default:
      return <EmployeeDashboard />;
  }
}
