import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import UserTable from "../../components/users/UserTable";
import UserForm from "../../components/users/UserForm";
import "../../styles/users/hrUsers.css";

const ROLE_ORDER = {
  HR: 1,
  MANAGER: 2,
  EMPLOYEE: 3,
};

export default function HrUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);

  const loadUsers = useCallback(async () => {
    const res = await api.get("/users");
    let list = res.data.users || [];

    if (user?.role === "HR") {
      list = list.filter((u) => u.role !== "ADMIN");

      list.sort((a, b) => {
        const ra = ROLE_ORDER[a.role] || 99;
        const rb = ROLE_ORDER[b.role] || 99;
        return ra - rb;
      });
    }

    setUsers(list);
  }, [user]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <div className="users-page hr">
      <div className="header">
        <h1>Users</h1>

        {(user?.role === "ADMIN" || user?.role === "HR") && (
          <button onClick={() => setActiveUser({ role: "EMPLOYEE" })}>
            + Create User
          </button>
        )}
      </div>

      <UserTable users={users} onEdit={setActiveUser} onRefresh={loadUsers} />

      {activeUser && (
        <UserForm
          user={activeUser}
          onClose={() => setActiveUser(null)}
          onSaved={loadUsers}
        />
      )}
    </div>
  );
}
