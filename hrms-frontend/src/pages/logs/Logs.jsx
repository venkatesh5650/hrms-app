import { useAuth } from "../../context/AuthContext";
import AdminLogs from "./AdminLogs";
import HrLogs from "./HrLogs";

export default function Logs() {
  const { user } = useAuth();

  if (user.role === "ADMIN") return <AdminLogs />;
  if (user.role === "HR") return <HrLogs />;

  return <p>Not authorized</p>;
}
