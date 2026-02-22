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

export default function HrUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      const filtered = filterUsersByDashboardRole(res.data.users || [], user?.role || "HR");

      const sorted = [...filtered].sort((a, b) => {
        const ra = ROLE_ORDER[a.role] || 99;
        const rb = ROLE_ORDER[b.role] || 99;
        return ra - rb;
      });

      setUsers(sorted);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <div className="users-page hr">
      <div className="mb-6 fade-in flex justify-between items-start">
        <div>
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-gray-900 leading-tight">Users</h1>
            {!loading && (
              <span className="ml-3 px-3 py-1 text-xs rounded-full bg-indigo-50 text-indigo-600">
                {users.length} {users.length === 1 ? 'user' : 'users'}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            View and manage organizational users
          </p>
        </div>

        {(user?.role === "ADMIN" || user?.role === "HR") && (
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-sm whitespace-nowrap"
            onClick={() => setActiveUser({ role: "EMPLOYEE" })}
          >
            + Create User
          </button>
        )}
      </div>

      <UserTable users={users} onEdit={setActiveUser} onRefresh={loadUsers} loading={loading} />

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
