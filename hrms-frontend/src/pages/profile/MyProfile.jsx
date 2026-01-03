import { useAuth } from "../../context/AuthContext";
import AdminProfile from "./AdminProfile";
import HrProfile from "./HrProfile";
import ManagerProfile from "./ManagerProfile";
// import EmployeeDashboard from "../../components/dashboards/EmployeeDashboard";


export default function MyProfile() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case "ADMIN":
      return <AdminProfile />;
    case "HR":
      return <HrProfile />;
    case "MANAGER":
      return <ManagerProfile />;
    default:
      return null;
  }
}
