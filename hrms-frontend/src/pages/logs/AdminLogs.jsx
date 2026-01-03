import { useEffect, useState } from "react";
import api from "../../services/api";
import LogTable from "../../components/logs/LogTable";
import LogFilters from "../../components/logs/LogFilters";
import "../../styles/logs/logsPage.css";

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({ action: "", user: "" });

  useEffect(() => {
    async function load() {
      const res = await api.get("/logs");

      console.log("Raw /logs API response:", res.data);

      const list = Array.isArray(res.data?.logs?.data)
        ? res.data.logs.data
        : [];

      console.log("Normalized logs list:", list);

      setLogs(list);
    }

    load();
  }, []);

  const filteredLogs = logs.filter((l) => {
    const userId = String(l.user_id ?? l.meta?.userId ?? "").trim();
    const action = String(l.action ?? "").toLowerCase().trim();

    const filterUser = filters.user.trim();
    const filterAction = filters.action.toLowerCase().trim();

    const matchesUser =
      !filterUser || userId === filterUser || userId.includes(filterUser);

    const matchesAction = !filterAction || action.includes(filterAction);

    return matchesUser && matchesAction;
  });

  return (
    <div className="logs-page">
      <div className="logs-card">
        <div className="logs-header">
          <div>
            <h1>Audit Logs</h1>
            <p className="subtitle">
              Monitor system activity and security-relevant events
            </p>
          </div>
          <span className="logs-count">{filteredLogs.length} Records</span>
        </div>

        <LogFilters filters={filters} setFilters={setFilters} />

        <LogTable logs={filteredLogs} />
      </div>
    </div>
  );
}
