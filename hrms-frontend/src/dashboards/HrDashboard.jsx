import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import KpiGrid from "../components/dashboard/KpiGrid";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import ApprovalStatusSummary from "../components/dashboard/ApprovalStatusSummary";
import WorkforceTrends from "../components/dashboard/WorkforceTrends";
import TeamDistribution from "../components/dashboard/TeamDistribution";
import OrphanEmployees from "../components/dashboard/OrphanEmployees";
import ApprovalAging from "../components/dashboard/ApprovalAging";
import "../styles/dashboardLoader.css";

const API = process.env.REACT_APP_API_BASE_URL;

export default function HrDashboard() {
  const { token, user } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [empRes, appRes, logRes] = await Promise.all([
          fetch(`${API}/employees`, { headers }),
          fetch(`${API}/approvals/history`, { headers }),
          fetch(`${API}/logs`, { headers }),
        ]);

        const empData = await empRes.json();
        const appData = await appRes.json();
        const logData = await logRes.json();

        const parsedLogs = Array.isArray(logData.logs?.data)
          ? logData.logs.data
          : Array.isArray(logData.logs)
          ? logData.logs
          : Array.isArray(logData.data)
          ? logData.data
          : Array.isArray(logData)
          ? logData
          : [];

        setEmployees(empData.employees || empData || []);
        setApprovals(appData.approvals || appData || []);
        setLogs(parsedLogs);
      } catch (err) {
        console.error("HR Dashboard load failed:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token]);

  // ---- Derived Data ----

  const myCreateApprovals = useMemo(
    () =>
      approvals.filter((a) => a.type === "CREATE" && a.user_id === user?.id),
    [approvals, user]
  );

  const reviewed = useMemo(
    () => myCreateApprovals.filter((a) => a.status !== "PENDING"),
    [myCreateApprovals]
  );

  const pending = useMemo(
    () => myCreateApprovals.filter((a) => a.status === "PENDING").length,
    [myCreateApprovals]
  );

  const approved = useMemo(
    () => myCreateApprovals.filter((a) => a.status === "APPROVED").length,
    [myCreateApprovals]
  );

  const rejected = useMemo(
    () => myCreateApprovals.filter((a) => a.status === "REJECTED").length,
    [myCreateApprovals]
  );

  const avgDecisionTimeSeconds = useMemo(() => {
    const diffs = reviewed
      .filter((a) => a.updated_at && a.created_at)
      .map((a) => (new Date(a.updated_at) - new Date(a.created_at)) / 1000);

    if (!diffs.length) return 0;
    return Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length);
  }, [reviewed]);

  // HR logs: where meta.role === "HR"
  const hrLogs = useMemo(
    () => logs.filter((l) => l.meta?.role === "HR"),
    [logs]
  );

  // Top actor across system
  const topActors = useMemo(() => {
    const counts = {};

    logs.forEach((l) => {
      const actorId = l.meta?.userId || l.meta?.createdUserId;
      if (!actorId) return;
      counts[actorId] = (counts[actorId] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([user_id, actions]) => ({ user_id: Number(user_id), actions }))
      .sort((a, b) => b.actions - a.actions)
      .slice(0, 1);
  }, [logs]);

   if (loading) {
    return (
      <div className="dashboard-loader">
        <div className="loader-card">
          <div className="pulse-ring"></div>
          <h2>HRMS</h2>
          <p>Preparing your HR dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>HR Overview</h1>

      <KpiGrid
        data={{
          approvals: [
            { status: "APPROVED", count: approved },
            { status: "REJECTED", count: rejected },
          ],
          avgDecisionTimeSeconds,
          topActors,
        }}
      />

      <div className="dashboard-row">
        <WorkforceTrends employees={employees} />
        <TeamDistribution employees={employees} />
      </div>

      <div className="dashboard-row">
        <OrphanEmployees employees={employees} />
        <ApprovalAging approvals={myCreateApprovals} />
      </div>

      <div className="dashboard-row">
        <ApprovalStatusSummary
          pending={pending}
          approved={approved}
          rejected={rejected}
        />
        <ActivityFeed logs={hrLogs.slice(0, 5)} />
      </div>
    </div>
  );
}
