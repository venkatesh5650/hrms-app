import React, { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState("");

  const loadLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/logs", {
        params: filterAction ? { action: filterAction } : {},
      });
      setLogs(res.data.logs || []);
    } catch (err) {
      console.error("Failed to load logs:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Only load once on mount, not on every filter change
  useEffect(() => {
    loadLogs();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Audit Logs</h1>
          <p className="page-subtitle">
            Full history of authentication and data operations.
          </p>
        </div>
        <div className="logs-filters">
          <input
            placeholder="Filter by action (e.g. employee_created)"
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                loadLogs(); // 🔹 Only fetch when Enter is pressed
              }
            }}
          />
          <button className="btn btn-small" onClick={loadLogs}>
            Refresh
          </button>
        </div>
      </div>

      <div className="card">
        {logs.length === 0 ? (
          <p className="muted">No logs yet.</p>
        ) : (
          <table className="table table-logs">
            <thead>
              <tr>
                <th>Time</th>
                <th>Action</th>
                <th>User ID</th>
                <th>Meta</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                  <td>{log.action}</td>
                  <td>{log.user_id || "-"}</td>
                  <td>
                    <code className="code-small">
                      {JSON.stringify(log.meta || {})}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Logs;
