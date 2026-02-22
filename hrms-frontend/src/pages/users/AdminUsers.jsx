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

function filterUsersByDashboardRole(users, role) {
  if (role === "ADMIN") return users;
  if (role === "HR") {
    return users.filter(u =>
      ["HR", "MANAGER", "EMPLOYEE"].includes(u.role)
    );
  }
  if (role === "MANAGER") {
    return users.filter(u => u.role === "EMPLOYEE");
  }
  return users;
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      const filtered = filterUsersByDashboardRole(res.data.users || [], "ADMIN");
      const sorted = [...filtered].sort(
        (a, b) => ROLE_ORDER[a.role] - ROLE_ORDER[b.role]
      );
      setUsers(sorted);
    } finally {
      setLoading(false);
    }
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
      <div className="mb-6 fade-in flex justify-between items-start">
        <div>
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-gray-900 leading-tight">Users</h1>
            {!loading && (
              <span className="ml-3 px-3 py-1 text-xs rounded-full bg-indigo-50 text-indigo-600">
                {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Manage platform users, update profile details, and control access levels.
          </p>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-sm whitespace-nowrap"
          onClick={() => setActiveUser({})}
        >
          + Create User
        </button>
      </div>

      <div className="users-toolbar">
        <input
          type="text"
          placeholder="Search users by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <UserTable users={filteredUsers} onEdit={setActiveUser} loading={loading} />

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
