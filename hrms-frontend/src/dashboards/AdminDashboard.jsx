import { useEffect, useMemo, useState } from "react";
import {
  fetchPendingApprovals,
  fetchApprovalHistory,
  fetchRecentLogs,
} from "../services/dashboardApi";

import KpiGrid from "../components/dashboard/KpiGrid";
import ApprovalPipelineChart from "../components/dashboard/ApprovalPipelineChart";
import ActivityFeed from "../components/dashboard/ActivityFeed";

import "../styles/dashboardLoader.css";


export default function AdminDashboard() {
  const [pending, setPending] = useState([]);
  const [history, setHistory] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [p, h, l] = await Promise.all([
          fetchPendingApprovals(),
          fetchApprovalHistory(),
          fetchRecentLogs(),
        ]);

        const allPending = p.data.approvals || [];
        const allHistory = h.data.approvals || [];

        setPending(allPending.filter((a) => a.type === "LOGIN_ACCESS"));
        setHistory(allHistory.filter((a) => a.type === "LOGIN_ACCESS"));
        setLogs(l.data.logs?.data || []);
      } catch (err) {
        console.error("Admin dashboard load failed:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // ---- Derived metrics ----

  const reviewed = useMemo(
    () =>
      history.filter((a) => a.status === "APPROVED" || a.status === "REJECTED"),
    [history]
  );

  const avgDecisionTimeSeconds = useMemo(() => {
    const diffs = reviewed
      .filter((a) => a.updated_at && a.created_at)
      .map((a) => (new Date(a.updated_at) - new Date(a.created_at)) / 1000);

    if (!diffs.length) return 0;
    return Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length);
  }, [reviewed]);

  // ✅ FIXED Top Actor logic (from meta.userId + meta.role)
  const topActors = useMemo(() => {
    const counts = {};

    logs.forEach((l) => {
      const actorId = l.meta?.userId;
      const role = l.meta?.role;

      if (!actorId || !role) return;

      const key = `${actorId}-${role}`;

      if (!counts[key]) {
        counts[key] = { user_id: actorId, role, actions: 0 };
      }

      counts[key].actions += 1;
    });

    return Object.values(counts)
      .sort((a, b) => b.actions - a.actions)
      .slice(0, 1);
  }, [logs]);

  if (loading) {
    return (
      <div className="dashboard-loader">
        <div className="loader-card">
          <div className="pulse-ring"></div>
          <h2>HRMS</h2>
          <p>Preparing your admin dashboard…</p>
        </div>
      </div>
    );
  }

  const approved = reviewed.filter((a) => a.status === "APPROVED").length;
  const rejected = reviewed.filter((a) => a.status === "REJECTED").length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Overview</h1>
        <p>Login access approvals</p>
      </div>

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

      <div className="dashboard-main">
        <ApprovalPipelineChart pending={pending} history={history} />
        <ActivityFeed logs={logs.slice(0, 5)} />
      </div>
    </div>
  );
}
