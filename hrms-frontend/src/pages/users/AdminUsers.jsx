import { useEffect, useState, useMemo } from "react";
import api from "../../services/api";
import UserTable from "../../components/users/UserTable";
import UserForm from "../../components/users/UserForm";
import "../../styles/users/adminUsers.css";

const ROLE_ORDER = {
  ADMIN: 1,
  HR: 2,
  MANAGER: 3,
  EMPLOYEE: 4,
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [search, setSearch] = useState("");

  const loadUsers = async () => {
    const res = await api.get("/users");
    const sorted = [...res.data.users].sort(
      (a, b) => ROLE_ORDER[a.role] - ROLE_ORDER[b.role]
    );
    setUsers(sorted);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  return (
    <div className="users-page admin">
      <div className="header">
        <div>
          <h1>Users</h1>
          <p className="subtitle">
            Manage platform users, update profile details, and control access
            levels.
          </p>
        </div>
        <button onClick={() => setActiveUser({})}>+ Create User</button>
      </div>

      <div className="users-toolbar">
        <input
          type="text"
          placeholder="Search users by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <UserTable users={filteredUsers} onEdit={setActiveUser} />

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
