import { useAuth } from "../../context/AuthContext";
import AdminUsers from "./AdminUsers";
import HrUsers from "./HrUsers";

export default function Users() {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role === "ADMIN") return <AdminUsers />;
  if (user.role === "HR") return <HrUsers />;

  return <p style={{ padding: 24 }}>Not authorized to view users.</p>;
}
