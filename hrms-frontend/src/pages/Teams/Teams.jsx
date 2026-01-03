import { useAuth } from "../../context/AuthContext";
import HrTeams from "./HrTeams";
import ManagerTeams from "./ManagerTeams";
import AdminTeams from "./AdminTeams";

export default function Teams() {
  const { user } = useAuth();

  if (user.role === "HR") return <HrTeams />;
  if (user.role === "MANAGER") return <ManagerTeams />;
  if (user.role === "ADMIN") return <AdminTeams />;

  return <p>Not authorized</p>;
}
