import "../../styles/logs/logTable.css";
import AppSpinner from "../common/AppSpinner";

export default function LogTable({ logs, loading = false }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <AppSpinner />
      </div>
    );
  }
  if (!logs.length) return <p className="empty-state">No logs found.</p>;

  return (
    <div className="table-wrapper">
      <table className="log-table">
        <thead>
          <tr>
            <th>Created At</th>
            <th>Action</th>
            <th>Role</th>
            <th>User ID</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l) => {
            const createdAt = new Date(l.created_at || l.timestamp).toLocaleString();
            const action = l.action || "-";
            const role = l.role; // Render role directly from API response
            const userId = l.user_id || l.meta?.userId || "-";

            let actionStyle = "bg-gray-100 text-gray-600";
            if (action === "access_denied") actionStyle = "bg-red-50 text-red-600";
            if (action === "login_success") actionStyle = "bg-emerald-50 text-emerald-600";

            let roleStyle = "bg-gray-100 text-gray-600";
            if (role === "ADMIN") roleStyle = "bg-indigo-50 text-indigo-600";
            if (role === "HR") roleStyle = "bg-emerald-50 text-emerald-600";
            if (role === "UNKNOWN") roleStyle = "bg-yellow-50 text-yellow-600";

            return (
              <tr key={l.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="text-sm text-gray-600 font-medium">{createdAt}</td>
                <td>
                  <span className={`text-xs px-2 py-1 rounded-full ${actionStyle}`}>
                    {action}
                  </span>
                </td>
                <td>
                  <span className={`text-xs px-2 py-1 rounded-full ${roleStyle}`}>
                    {role}
                  </span>
                </td>
                <td>{userId}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
