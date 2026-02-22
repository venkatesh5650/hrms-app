import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useDemoGuard } from "../../hooks/useDemoGuard";
import api from "../../services/api";
import AppSpinner from "../common/AppSpinner";
import "../../styles/users/userTable.css";

export default function UserTable({
  users,
  onEdit,
  onRefresh,
  loading = false,
}) {
  const { user: currentUser } = useAuth();
  const currentRole = currentUser?.role;
  const { guardWriteAction, DemoModal } = useDemoGuard();

  const [promoteTarget, setPromoteTarget] = useState(null);
  const [nextRole, setNextRole] = useState("MANAGER");

  /* ===============================
     DEBUG LOGS (SAFE FOR DEV MODE)
  =============================== */
  useEffect(() => {
    console.log("🔐 Logged-in user:", currentUser);
    console.log("🔐 Current role:", currentRole);
  }, [currentUser, currentRole]);

  useEffect(() => {
    console.log("📦 Users received:", users);
  }, [users]);

  /* ===============================
     PROMOTE USER
  =============================== */
  const confirmPromote = guardWriteAction(async () => {
    if (!promoteTarget) return;

    try {
      const res = await api.put(`/users/${promoteTarget.id}/role`, {
        role: nextRole,
      });

      console.log("✅ Promote success:", res.data);

      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("❌ Promotion failed:", err?.response?.data || err.message);
      alert("Promotion failed. Check permissions.");
    } finally {
      setPromoteTarget(null);
    }
  });

  /* ===============================
     ROLE BADGE
  =============================== */
  const renderRoleBadge = (role) => {
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${role === "ADMIN"
          ? "bg-purple-100 text-purple-700"
          : role === "HR"
            ? "bg-indigo-100 text-indigo-700"
            : role === "MANAGER"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-gray-100 text-gray-600"
          }`}
      >
        {role}
      </span>
    );
  };

  /* ===============================
     ACTION BUTTONS
  =============================== */
  const renderActions = (u) => {
    const role = u.role;

    const disabledEdit = (
      <button
        disabled
        title="Protected account"
        className="px-3 py-1.5 text-sm font-medium text-indigo-600 opacity-50 cursor-not-allowed"
      >
        Edit
      </button>
    );

    /* ===== ADMIN PERMISSIONS ===== */
    if (currentRole === "ADMIN") {
      if (role === "EMPLOYEE") return disabledEdit;

      return (
        <button
          className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md"
          onClick={guardWriteAction(() => onEdit(u))}
        >
          Edit
        </button>
      );
    }

    /* ===== HR PERMISSIONS ===== */
    if (currentRole === "HR") {
      if (role === "ADMIN") return disabledEdit;

      if (role === "EMPLOYEE") {
        return (
          <>
            <button
              className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md"
              onClick={guardWriteAction(() => onEdit(u))}
            >
              Edit
            </button>

            <button
              className="px-3 py-1.5 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 rounded-md shadow-sm"
              onClick={guardWriteAction(() => {
                setPromoteTarget(u);
                setNextRole("MANAGER");
              })}
            >
              Promote
            </button>
          </>
        );
      }

      return (
        <button
          className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md"
          onClick={guardWriteAction(() => onEdit(u))}
        >
          Edit
        </button>
      );
    }

    return disabledEdit;
  };

  /* ===============================
     LOADING STATE
  =============================== */
  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <AppSpinner />
      </div>
    );
  }

  if (!users?.length) {
    return <p className="empty-state">No users found.</p>;
  }

  /* ===============================
     MAIN TABLE
  =============================== */
  return (
    <>
      <DemoModal />
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide w-1/3">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide w-1/3">
                  Email
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Role
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-50">
              {users.map((u) => {
                const initials =
                  (u.name?.[0] || u.email?.[0] || "?").toUpperCase();

                return (
                  <tr
                    key={u.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-semibold">
                          {initials}
                        </div>
                        <div className="font-medium text-gray-900">
                          {u.name}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-3 text-sm text-gray-500 break-all">
                      {u.email}
                    </td>

                    <td className="px-6 py-3 text-center">
                      {renderRoleBadge(u.role)}
                    </td>

                    <td className="px-6 py-3 text-right space-x-2">
                      {renderActions(u)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===============================
          PROMOTE MODAL
      =============================== */}
      {promoteTarget && (
        <div className="modal-overlay">
          <div className="modal-content small">
            <h3 className="mb-3">
              Promote {promoteTarget.name}
            </h3>

            <select
              value={nextRole}
              onChange={(e) => setNextRole(e.target.value)}
            >
              <option value="MANAGER">MANAGER</option>
              <option value="HR">HR</option>
            </select>

            <div className="actions mt-4">
              <button className="primary" onClick={confirmPromote}>
                Confirm
              </button>

              <button
                className="cancel"
                onClick={() => setPromoteTarget(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}