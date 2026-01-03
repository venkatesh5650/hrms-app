import { useState, Fragment } from "react";

export default function ActivityFeed({ logs = [] }) {
  const [expandedRow, setExpandedRow] = useState(null);
  

  return (
    <div className="card">
      <h3>Recent Activity</h3>

      {logs.length === 0 ? (
        <p className="empty">No activity yet</p>
      ) : (
        <div className="table-wrapper">
          <table className="activity-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Role</th>
                <th>Action</th>
                <th>Context</th>
              </tr>
            </thead>
            <tbody>
              {logs.slice(0, 8).map((log) => {
                const isExpanded = expandedRow === log.id;

                return (
                  <Fragment key={log.id}>
                    <tr
                      className="activity-row"
                      onClick={() => setExpandedRow(isExpanded ? null : log.id)}
                      tabIndex={0}
                    >
                      <td data-label="Time">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                      <td data-label="Role">{log.meta?.role || "System"}</td>
                      <td
                        data-label="Action"
                        className="action-cell"
                        title={log.action}
                      >
                        {log.action.replaceAll("_", " ")}
                      </td>
                      <td data-label="Context">
                        {log.meta?.userId ? `User #${log.meta.userId}` : "-"}
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="expand-row">
                        <td colSpan={4}>
                          <pre className="expand-content">
                            {JSON.stringify(log.meta, null, 2)}
                          </pre>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
