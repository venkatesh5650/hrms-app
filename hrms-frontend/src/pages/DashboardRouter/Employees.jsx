import { useAuth } from "../../context/AuthContext";
import AdminEmployees from "../Employees/AdminEmployees";
import HrEmployees from "../Employees/HrEmployees";
import ManagerEmployees from "../Employees/ManagerEmployees";

export default function Employees() {
  const { user } = useAuth();

  if (user.role === "ADMIN") return <AdminEmployees />;
  if (user.role === "HR") return <HrEmployees />;
  if (user.role === "MANAGER") return <ManagerEmployees />;

  return <p>Not authorized</p>;
}
