import { useState } from "react";
import AppSpinner from "../common/AppSpinner";
import { useAuth } from "../../context/AuthContext";

export default function ActivityFeed({ logs = [], loading = false }) {
  const [expandedRow, setExpandedRow] = useState(null);
  const { user } = useAuth();

  // 🟢 Enterprise-safe time formatter
  const formatTime = (log) => {
    const rawTime = log.timestamp || log.created_at || log.time;
    if (!rawTime) return "-";

    const date = new Date(rawTime);
    if (isNaN(date.getTime())) return "-";

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // 🟢 Role resolver
  const resolveRole = (log) => {
    return log.role || log.meta?.role || "System";
  };

  // 🟢 Context resolver
  const resolveContext = (log) => {
    const userId = log.user_id || log.meta?.userId;
    return userId ? `User #${userId}` : "-";
  };

  // 🟢 Filter is now performed server-side natively.

  // 🟢 Map Logs to Natural Language Messages
  const mapLogToMessage = (log, currentRole) => {
    // Attempt mapping
    let msg = log.action.replaceAll("_", " ");

    if (log.action === "user_logged_out") msg = "logged out from the system.";
    if (log.action === "team_created") msg = "created a new team";
    if (log.action === "team_updated") msg = "updated team information";
    if (log.action === "team_deleted") msg = "deleted a team";
    if (log.action === "manager_assigned_to_team") msg = "assigned a team manager";
    if (log.action === "employee_assigned_to_team") msg = "assigned an employee to a team";
    if (log.action === "employee_unassigned_from_team") msg = "unassigned an employee";
    if (log.action === "employee_created") msg = "added a new employee";
    if (log.action === "employee_updated") msg = "updated an employee record";
    if (log.action === "employee_soft_deleted" || log.action === "employee_deleted") msg = "removed an employee record";
    if (log.action === "employee_restored") msg = "restored an employee record";
    if (log.action === "approval_approved") msg = "approved a request";
    if (log.action === "approval_rejected") msg = "rejected a request";
    if (log.action === "user_created") msg = "provisioned a new user account";
    if (log.action === "user_updated") msg = "updated a user account";
    if (log.action === "user_role_updated") msg = "modified a user's role permissions";
    if (log.action === "employee_login_linked") msg = "linked a user login to an employee";
    if (log.action === "manager_created_and_linked") msg = "provisioned a new manager login";
    if (log.action === "organisation_created") msg = "updated system tenant configuration";
    if (log.action === "access_denied") msg = "was denied security access";

    // Reconstruct the full conversational span
    const actorRole = resolveRole(log);
    const contextStr = resolveContext(log);

    return (
      <div className="text-[13px] leading-relaxed">
        <span className="font-semibold text-gray-800">{actorRole}</span>
        <span className="text-gray-600"> {msg}</span>
        {contextStr !== "-" && (
          <span className="text-gray-600"> concerning <span className="font-medium text-gray-800">{contextStr}</span></span>
        )}
      </div>
    );
  };

  // 🟢 Feed is pre-sliced and mapped by backend
  const viewerRole = user?.role || "ADMIN";
  const activityFeed = logs;

  // 🟢 Relative Time Formatter (2m ago)
  const formatRelativeTime = (log) => {
    const rawTime = log.timestamp || log.created_at || log.time;
    if (!rawTime) return "-";

    const date = new Date(rawTime);
    if (isNaN(date.getTime())) return "-";

    const diffMs = new Date() - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <AppSpinner />
        </div>
      ) : activityFeed.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p className="text-sm font-medium">You're all caught up 🎉</p>
          <p className="text-xs mt-1">New HR actions will appear here.</p>
        </div>
      ) : (
        <div className="flex flex-col space-y-2 mt-4">
          {activityFeed.map((log) => {
            const isExpanded = expandedRow === log.id;

            return (
              <div key={log.id}>
                <div
                  className="flex gap-4 items-start py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                  onClick={() => setExpandedRow(isExpanded ? null : log.id)}
                >
                  {/* ICON AVATAR */}
                  <div className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full bg-gray-50 border border-gray-100/50">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>

                  {/* MESSAGE CONTENT */}
                  <div className="flex flex-col flex-1 mt-0.5">
                    {mapLogToMessage(log, viewerRole)}

                    <span className="text-[11px] font-medium text-gray-400 mt-1">
                      {formatRelativeTime(log)}
                    </span>
                  </div>
                </div>

                {/* EXPANDED DETAILS */}
                {isExpanded && (
                  <div className="bg-gray-50/80 px-4 py-3 ml-2 mb-2 rounded-lg border border-gray-100/50 border-solid text-sm">
                    <div className="flex gap-2 flex-wrap">
                      {log.meta && Object.entries(log.meta).length > 0 ? (
                        Object.entries(log.meta).map(([key, value]) => (
                          <span
                            key={key}
                            className="bg-gray-200/50 text-gray-700 px-2 py-1 rounded-md text-xs font-medium border border-gray-200"
                          >
                            <span className="text-gray-500 mr-1">{key}:</span>
                            {typeof value === "object" ? JSON.stringify(value) : String(value)}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400 italic">No additional context available.</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}