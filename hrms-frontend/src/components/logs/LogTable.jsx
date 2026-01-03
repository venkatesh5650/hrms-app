import "../../styles/logs/logTable.css";

export default function LogTable({ logs }) {
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
            const createdAt = new Date(l.timestamp).toLocaleString();
            const action = l.action || "-";
            const role = l.meta?.role || "-";
            const userId = l.user_id || l.meta?.userId || "-";

            return (
              <tr key={l.id}>
                <td>{createdAt}</td>
                <td>{action}</td>
                <td>{role}</td>
                <td>{userId}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
