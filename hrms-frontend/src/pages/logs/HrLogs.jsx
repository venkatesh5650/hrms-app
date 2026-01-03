import { useEffect, useState } from "react";
import api from "../../services/api";
import LogTable from "../../components/logs/LogTable";
import LogFilters from "../../components/logs/LogFilters";

import "../../styles/logs/logsPage.css";

export default function HrLogs() {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({ action: "", user: "" });

  useEffect(() => {
    api
      .get("/logs")
      .then((res) => {
        console.log("📦 Raw logs response:", res.data);

        const list =
          Array.isArray(res.data) ? res.data :
          Array.isArray(res.data.logs) ? res.data.logs :
          Array.isArray(res.data.logs?.data) ? res.data.logs.data :
          [];

        console.log("✅ Normalized logs:", list);
        setLogs(list);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch logs:", err);
        setLogs([]);
      });
  }, []);

  const safeLogs = Array.isArray(logs) ? logs : [];

  const filteredLogs = safeLogs.filter((l) => {
    const matchesUser =
      !filters.user ||
      String(l.user_id).includes(filters.user.trim()) ||
      l.user?.name?.toLowerCase().includes(filters.user.toLowerCase());

    const matchesAction =
      !filters.action ||
      l.action?.toLowerCase().includes(filters.action.toLowerCase());

    return matchesUser && matchesAction;
  });

  return (
    <div className="logs-page">
      <h1>Activity Logs</h1>
      <p className="subtitle">Track operational events</p>

      <LogFilters filters={filters} setFilters={setFilters} />
      <LogTable logs={filteredLogs} />
    </div>
  );
}
