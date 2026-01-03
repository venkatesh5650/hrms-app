import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "../../styles/users/userTable.css";

const resolveRole = (u) => {
  const name = u?.name?.toLowerCase() || "";
  if (name.includes("admin")) return "ADMIN";
  if (name.includes("hr")) return "HR";
  if (name.includes("manager")) return "MANAGER";
  return "EMPLOYEE";
};

export default function UserTable({ users, onEdit, onRefresh }) {
  const { user: currentUser } = useAuth();
  const currentRole = resolveRole(currentUser || {});

  const [promoteTarget, setPromoteTarget] = useState(null);
  const [nextRole, setNextRole] = useState("MANAGER");

  // 🔍 Log logged-in user
  useEffect(() => {
    console.log("🔐 Logged-in user from context:", currentUser);
    console.log("🔐 Resolved current role:", currentRole);
  }, [currentUser, currentRole]);

  // 🔍 Log all users whenever list changes
  useEffect(() => {
    console.log("📦 Users received in table:", users);
    users.forEach((u) => {
      console.log(`👤 ${u.name} → resolved role: ${resolveRole(u)}`);
    });
  }, [users]);

  const confirmPromote = async () => {
    if (!promoteTarget) return;

    console.log("⬆️ Confirm promote:", promoteTarget.name, "→", nextRole);

    try {
      const res = await api.put(`/users/${promoteTarget.id}/role`, {
        role: nextRole,
      });
      console.log("✅ Promote API response:", res.data);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("❌ Promotion failed:", err?.response?.data || err.message);
      alert("Promotion failed. Check permissions.");
    } finally {
      setPromoteTarget(null);
    }
  };

  const renderActions = (u) => {
    const role = resolveRole(u);

    console.log(
      `🎯 Rendering actions → row: ${u.name} (${role}) | logged-in: ${currentRole}`
    );

    if (currentRole === "ADMIN") {
      if (role === "EMPLOYEE")
        return <span className="cannot-edit">Cannot edit</span>;
      return (
        <button className="edit-btn" onClick={() => onEdit(u)}>
          Edit
        </button>
      );
    }

    if (currentRole === "HR") {
      if (role === "ADMIN")
        return <span className="cannot-edit">Cannot edit</span>;

      if (role === "EMPLOYEE") {
        return (
          <>
            <button className="edit-btn" onClick={() => onEdit(u)}>
              Edit
            </button>
            <button
              className="promote-btn"
              onClick={() => {
                console.log("🟢 Promote clicked for:", u.name);
                setPromoteTarget(u);
                setNextRole("MANAGER");
              }}
            >
              Promote
            </button>
          </>
        );
      }

      return (
        <button className="edit-btn" onClick={() => onEdit(u)}>
          Edit
        </button>
      );
    }

    return <span className="cannot-edit">Cannot edit</span>;
  };

  if (!users.length) {
    console.log("⚠️ No users passed to UserTable");
    return <p className="empty-state">No users found.</p>;
  }

  return (
    <>
      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => {
              return (
                <tr key={u.id}>
                  <td className="name-cell">{u.name}</td>
                  <td className="email-cell">{u.email}</td>
                  <td className="role-cell">{u.role}</td>
                  <td className="action-cell">{renderActions(u)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Promote Modal */}
      {promoteTarget && (
        <div className="modal-overlay">
          <div className="modal-content small">
            <h3>Promote {promoteTarget.name}</h3>

            <select
              value={nextRole}
              onChange={(e) => setNextRole(e.target.value)}
            >
              <option value="MANAGER">MANAGER</option>
              <option value="HR">HR</option>
            </select>

            <div className="actions">
              <button className="primary" onClick={confirmPromote}>
                Confirm
              </button>
              <button className="cancel" onClick={() => setPromoteTarget(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
