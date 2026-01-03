import { useEffect, useMemo, useState } from "react";
import {
  fetchPendingApprovals,
  fetchApprovalHistory,
  fetchRecentLogs,
} from "../services/dashboardApi";

import KpiGrid from "../components/dashboard/KpiGrid";
import ApprovalPipelineChart from "../components/dashboard/ApprovalPipelineChart";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import ApprovalAging from "../components/dashboard/ApprovalAging";
import ApprovalReasonAnalysis from "../components/dashboard/ApprovalReasonAnalysis";

import "../styles/dashboardLoader.css";

export default function ManagerDashboard() {
  const [pending, setPending] = useState([]);
  const [history, setHistory] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const results = await Promise.allSettled([
        fetchPendingApprovals(),
        fetchApprovalHistory(),
        fetchRecentLogs(),
      ]);

      const [pRes, hRes, lRes] = results;

      if (pRes.status === "fulfilled") {
        const raw = pRes.value?.data?.approvals || pRes.value?.data || [];
        setPending(raw.filter(a => a.type === "CREATE"));
      }

      if (hRes.status === "fulfilled") {
        const raw = hRes.value?.data?.approvals || hRes.value?.data || [];
        setHistory(raw.filter(a => a.type === "CREATE"));
      }

      if (lRes.status === "fulfilled") {
        setLogs(lRes.value?.data?.logs?.data || []);
      } else {
        setLogs([]);
      }

      setLoading(false);
    }

    load();
  }, []);

  // ---- Derived metrics ----

  const reviewed = useMemo(
    () => history.filter(a => a.status === "APPROVED" || a.status === "REJECTED"),
    [history]
  );

  const avgDecisionTimeSeconds = useMemo(() => {
    if (!reviewed.length) return 0;

    const diffs = reviewed
      .filter(a => a.updated_at && a.created_at)
      .map(a => (new Date(a.updated_at) - new Date(a.created_at)) / 1000);

    if (!diffs.length) return 0;

    return Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length);
  }, [reviewed]);

  const topActors = useMemo(() => {
    if (!logs.length) return [];

    const counts = {};

    logs.forEach(l => {
      const actorId = l.meta?.userId || l.user_id;
      if (!actorId) return;
      counts[actorId] = (counts[actorId] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([user_id, actions]) => ({ user_id: Number(user_id), actions }))
      .sort((a, b) => b.actions - a.actions)
      .slice(0, 1);
  }, [logs]);

  const approved = reviewed.filter(a => a.status === "APPROVED").length;
  const rejected = reviewed.filter(a => a.status === "REJECTED").length;

   if (loading) {
    return (
      <div className="dashboard-loader">
        <div className="loader-card">
          <div className="pulse-ring"></div>
          <h2>HRMS</h2>
          <p>Preparing your Manager dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Manager Overview</h1>
        <p>Employee creation approvals</p>
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

      <div className="dashboard-main manager-main">
        <ApprovalPipelineChart pending={pending} history={history} />

        <div className="manager-side">
          <ApprovalAging approvals={pending} />
          <ApprovalReasonAnalysis approvals={history} />

        </div>
      </div>

      {logs.length > 0 && (
        <div className="dashboard-row">
          <ActivityFeed logs={logs.slice(0, 5)} />
        </div>
      )}
    </div>
  );
}
