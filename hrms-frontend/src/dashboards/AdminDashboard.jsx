import { useEffect, useState } from "react";
import {
  fetchPendingApprovals,
  fetchApprovalHistory,
  fetchAdminActivity,
  fetchAdminOverview
} from "../services/dashboardApi";
import { fetchRoleSupportRequests } from "../services/supportApi";

import KpiGrid from "../components/dashboard/KpiGrid";
import ApprovalPipelineChart from "../components/dashboard/ApprovalPipelineChart";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import SupportRequestsCard from "../components/dashboard/SupportRequestsCard";
import AppSpinner from "../components/common/AppSpinner";

import "../styles/dashboardLoader.css";
export default function AdminDashboard() {
  const [pending, setPending] = useState([]);
  const [history, setHistory] = useState([]);
  const [logs, setLogs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [supportRequests, setSupportRequests] = useState([]);
  const [supportLoading, setSupportLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [p, h, l, a] = await Promise.all([
          fetchPendingApprovals(),
          fetchApprovalHistory(),
          fetchAdminActivity(),
          fetchAdminOverview()
        ]);

        const allPending = Array.isArray(p.data?.approvals) ? p.data.approvals : Array.isArray(p.data) ? p.data : [];
        const allHistory = Array.isArray(h.data?.approvals) ? h.data.approvals : Array.isArray(h.data) ? h.data : [];

        setPending(allPending.filter((a) => a.type === "LOGIN_ACCESS"));
        setHistory(allHistory.filter((a) => a.type === "LOGIN_ACCESS"));
        setLogs(l.data.feed || []);

        // Store backend analytics directly
        setAnalytics(a.data);
      } catch (err) {
        console.error("Admin dashboard load failed:", err);
      } finally {
        setLoading(false);
      }
    }

    load();

    async function loadSupport() {
      try {
        const res = await fetchRoleSupportRequests();
        setSupportRequests(Array.isArray(res.data?.requests) ? res.data.requests : []);
      } catch (err) {
        console.error("Admin support requests load failed:", err);
        setSupportRequests([]);
      } finally {
        setSupportLoading(false);
      }
    }
    loadSupport();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Overview</h1>
        <p>Login access approvals</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <AppSpinner />
        </div>
      ) : (
        <>
          <KpiGrid
            loading={loading}
            data={{
              approvals: [
                { status: "APPROVED", count: analytics?.approvedCount || 0 },
                { status: "REJECTED", count: analytics?.rejectedCount || 0 },
              ],
              avgDecisionTimeSeconds: analytics?.avgDecisionTimeSeconds || 0,
              topActors: analytics?.topActor ? [analytics.topActor] : null,
            }}
          />

          <div className="dashboard-main">
            <ApprovalPipelineChart pending={pending} history={history} />
            <ActivityFeed logs={logs} />
          </div>

          <SupportRequestsCard
            requests={supportRequests}
            loading={supportLoading}
            onResolve={(id) =>
              setSupportRequests((prev) =>
                prev.map((r) => (r.id === id ? { ...r, status: "RESOLVED" } : r))
              )
            }
          />
        </>
      )}
    </div>
  );
}
