import { CheckCircle2, XCircle, Clock, Award } from "lucide-react";

export default function KpiGrid({ data, loading }) {
  const approved =
    data.approvals.find((a) => a.status === "APPROVED")?.count || 0;
  const rejected =
    data.approvals.find((a) => a.status === "REJECTED")?.count || 0;

  // Robust Top Actor Selector
  const topActor =
    data.topActors?.[0] ||
    data.top_actor ||
    data.topActors?.data?.[0] ||
    null;

  // Trend logic
  const approvedTrend = approved >= rejected ? "up" : "down";
  const rejectedTrend = rejected > approved ? "up" : "down";

  // Time formatting logic
  // Industry Standard Time Formatter
  const formatTime = (seconds) => {
    if (!seconds || seconds === 0) return "0m";

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days >= 1) {
      return `${days}d ${hours}h`;
    }
    if (hours >= 1) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const Trend = ({ direction }) => (
    <span
      style={{
        fontSize: "0.75rem",
        marginLeft: 6,
        color: direction === "up" ? "#16a34a" : "#dc2626",
      }}
    >
      {direction === "up" ? "▲ Up" : "▼ Down"}
    </span>
  );

  return (
    <div className="kpi-grid">
      <div className="kpi-card p-6 flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-widest mt-0.5">Approved Requests</span>
        </div>
        <div>
          <div className="text-3xl font-bold text-gray-900 leading-none">
            {loading ? <span className="text-lg font-normal text-gray-400">...</span> : <div className="flex items-baseline gap-2">{approved} <Trend direction={approvedTrend} /></div>}
          </div>
          <div className="text-xs text-gray-400 mt-2 font-medium">vs Rejections</div>
        </div>
      </div>

      <div className="kpi-card p-6 flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
            <XCircle size={20} />
          </div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-widest mt-0.5">Rejected Requests</span>
        </div>
        <div>
          <div className="text-3xl font-bold text-gray-900 leading-none">
            {loading ? <span className="text-lg font-normal text-gray-400">...</span> : <div className="flex items-baseline gap-2">{rejected} <Trend direction={rejectedTrend} /></div>}
          </div>
          <div className="text-xs text-gray-400 mt-2 font-medium">vs Approvals</div>
        </div>
      </div>

      <div className="kpi-card p-6 flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
            <Clock size={20} />
          </div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-widest mt-0.5">Avg Processing Time</span>
        </div>
        <div>
          <div className="text-3xl font-bold text-gray-900 leading-none">
            {loading ? <span className="text-lg font-normal text-gray-400">...</span> : formatTime(data.avgDecisionTimeSeconds || 0)}
          </div>
          <div className="text-xs text-gray-400 mt-2 font-medium">Last 30 days</div>
        </div>
      </div>

      <div className="kpi-card p-6 flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Award size={20} />
          </div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-widest mt-0.5">Top Actor</span>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900 leading-tight">
            {loading ? <span className="text-lg font-normal text-gray-400">...</span> : topActor ? (
              <div className="flex items-center gap-2">
                User #{topActor.user_id}
                {topActor.role && (
                  <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-bold tracking-wide uppercase">
                    {topActor.role}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-gray-400 font-normal">No activity yet</span>
            )}
          </div>
          <div className="text-xs text-gray-400 mt-1.5 font-medium">
            {topActor ? `${topActor.actions} actions · last 7 days` : "No activity yet"}
          </div>
        </div>
      </div>
    </div>
  );
}
