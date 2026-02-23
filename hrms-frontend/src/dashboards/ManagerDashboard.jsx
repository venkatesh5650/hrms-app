import { useEffect, useMemo, useState } from "react";
import {
  fetchPendingApprovals,
  fetchApprovalHistory,
  fetchDashboardStats,
} from "../services/dashboardApi";
import { fetchRoleSupportRequests } from "../services/supportApi";

import KpiGrid from "../components/dashboard/KpiGrid";
import ApprovalPipelineChart from "../components/dashboard/ApprovalPipelineChart";
import ApprovalAging from "../components/dashboard/ApprovalAging";
import ApprovalReasonAnalysis from "../components/dashboard/ApprovalReasonAnalysis";
import SupportRequestsCard from "../components/dashboard/SupportRequestsCard";
import AppSpinner from "../components/common/AppSpinner";

import "../styles/dashboardLoader.css";

export default function ManagerDashboard() {
  const [pending, setPending] = useState([]);
  const [history, setHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [supportRequests, setSupportRequests] = useState([]);
  const [supportLoading, setSupportLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const results = await Promise.allSettled([
          fetchPendingApprovals(),
          fetchApprovalHistory(),
          fetchDashboardStats(),
        ]);

        const [pRes, hRes, aRes] = results;

        if (pRes.status === "fulfilled") {
          let raw = [];
          if (Array.isArray(pRes.value?.data?.approvals)) raw = pRes.value.data.approvals;
          else if (Array.isArray(pRes.value?.data)) raw = pRes.value.data;
          else if (Array.isArray(pRes.value)) raw = pRes.value;
          setPending(raw.filter(a => a.type === "CREATE"));
        }

        if (hRes.status === "fulfilled") {
          let raw = [];
          if (Array.isArray(hRes.value?.data?.approvals)) raw = hRes.value.data.approvals;
          else if (Array.isArray(hRes.value?.data)) raw = hRes.value.data;
          else if (Array.isArray(hRes.value)) raw = hRes.value;
          setHistory(raw.filter(a => a.type === "CREATE"));
        }

        if (aRes.status === "fulfilled") {
          setAnalytics(aRes.value.data);
        }
      } catch (err) {
        console.error("ManagerDashboard load error:", err);
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
        console.error("Manager support requests load failed:", err);
        setSupportRequests([]);
      } finally {
        setSupportLoading(false);
      }
    }
    loadSupport();
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

  // Prioritize backend analytics for Avg Processing Time
  const avgProcessingTime = analytics?.avgDecisionTimeSeconds ?? avgDecisionTimeSeconds;

  // Managers use top actors from analytics
  const topActors = analytics?.topActors || (analytics?.topActor ? [analytics.topActor] : []);

  const approved = reviewed.filter(a => a.status === "APPROVED").length;
  const rejected = reviewed.filter(a => a.status === "REJECTED").length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Manager Overview</h1>
        <p>Employee creation approvals</p>
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
                { status: "APPROVED", count: approved },
                { status: "REJECTED", count: analytics?.rejectedCount || rejected },
              ],
              avgDecisionTimeSeconds: avgProcessingTime,
              topActors: topActors,
            }}
          />

          <div className="dashboard-main manager-main">
            <ApprovalPipelineChart pending={pending} history={history} />

            <div className="manager-side">
              <ApprovalAging approvals={pending} />
              <ApprovalReasonAnalysis approvals={history} />
            </div>
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
