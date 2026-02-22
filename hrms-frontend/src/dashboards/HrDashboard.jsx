import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useDemoGuard } from "../hooks/useDemoGuard";
import { fetchHrActivity } from "../services/dashboardApi";
import KpiGrid from "../components/dashboard/KpiGrid";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import ApprovalStatusSummary from "../components/dashboard/ApprovalStatusSummary";
import WorkforceTrends from "../components/dashboard/WorkforceTrends";
import TeamDistribution from "../components/dashboard/TeamDistribution";
import OrphanEmployees from "../components/dashboard/OrphanEmployees";
import ApprovalAging from "../components/dashboard/ApprovalAging";
import AppSpinner from "../components/common/AppSpinner";
import "../styles/dashboardLoader.css";

const API = process.env.REACT_APP_API_BASE_URL;

export default function HrDashboard() {
  const { token } = useAuth();
  useDemoGuard();

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
          fetchHrActivity(),
        ]);

        const empData = await empRes.json();
        const appData = await appRes.json();
        const logData = logRes.data;

        const parsedLogs = Array.isArray(logData.feed)
          ? logData.feed
          : [];

        setEmployees(
          Array.isArray(empData.employees) ? empData.employees
            : Array.isArray(empData.data) ? empData.data
              : Array.isArray(empData) ? empData : []
        );
        setApprovals(
          Array.isArray(appData.approvals) ? appData.approvals
            : Array.isArray(appData.data) ? appData.data
              : Array.isArray(appData) ? appData : []
        );
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
      approvals.filter((a) => {
        // HR usually oversees ALL creates, or creates specifically routed to them.
        // If we strictly check `a.user_id === user?.id`, they only see their OWN requests.
        // Let's reveal all pending CREATE approvals for HR.
        return a.type === "CREATE";
      }),
    [approvals]
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

  // Top actor across system
  const topActors = useMemo(() => {
    const counts = {};

    logs.forEach((l) => {
      const actorId = l.user_id || l.meta?.userId || l.meta?.createdUserId;
      if (!actorId) return;

      // Grab role from new log schema or fallback to meta/unknown
      const role = l.role || l.user_role || l.meta?.role || "USER";

      if (!counts[actorId]) {
        counts[actorId] = { user_id: Number(actorId), role, actions: 0 };
      }
      counts[actorId].actions += 1;
    });

    return Object.values(counts)
      .sort((a, b) => b.actions - a.actions)
  }, [logs]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>HR Overview</h1>
        <p>Human resources management</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <AppSpinner />
        </div>
      ) : (
        <div className="space-y-6 mt-6">
          <KpiGrid
            loading={loading}
            data={{
              approvals: [
                { status: "APPROVED", count: approved },
                { status: "REJECTED", count: rejected },
              ],
              avgDecisionTimeSeconds,
              topActors,
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WorkforceTrends employees={employees} />
            <TeamDistribution employees={employees} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OrphanEmployees employees={employees} />
            <ApprovalAging approvals={myCreateApprovals} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ApprovalStatusSummary
              pending={pending}
              approved={approved}
              rejected={rejected}
            />
            <ActivityFeed logs={logs} />
          </div>
        </div>
      )}
    </div>
  );
}
