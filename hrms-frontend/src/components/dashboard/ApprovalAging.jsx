import { differenceInHours } from "date-fns";
import { Clock } from "lucide-react";
import "../../styles/dashboard/approvalAging.css";
import AppSpinner from "../common/AppSpinner";

export default function ApprovalAging({ approvals, loading = false }) {
  const now = new Date();

  // Approvals are pre-filtered by the dashboard context.
  // We only require them to be pending requests.
  const pendingCreates = approvals.filter((a) => a.status === "PENDING");

  if (loading) {
    return (
      <div className="card aging-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Aging</h3>
        <div className="flex justify-center items-center py-12">
          <AppSpinner />
        </div>
      </div>
    );
  }

  if (pendingCreates.length === 0) {
    return (
      <div className="card aging-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Aging</h3>
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg text-center px-6 py-10 min-h-[180px] flex flex-col justify-center items-center transition-all duration-300 opacity-80 hover:opacity-100">
          <Clock className="w-8 h-8 text-gray-400 mb-3" />
          <h4 className="text-sm font-semibold text-gray-900 mb-1">No Pending Approvals</h4>
          <p className="text-xs text-gray-500 max-w-[200px] leading-relaxed">
            Pending approvals will be tracked here once they are submitted.
          </p>
        </div>
      </div>
    );
  }

  const ages = pendingCreates.map((a) =>
    differenceInHours(now, new Date(a.created_at))
  );

  const avgHours = Math.round(ages.reduce((a, b) => a + b, 0) / ages.length);
  const maxHours = Math.max(...ages);
  const overdue = ages.filter((h) => h > 72).length;

  const formatHours = (h) => {
    if (h < 24) return `${h}h`;
    const days = Math.floor(h / 24);
    const remainder = h % 24;
    return remainder > 0 ? `${days}d ${remainder}h` : `${days}d`;
  };

  const stats = [
    { label: "Pending", value: pendingCreates.length },
    { label: "Avg Wait", value: formatHours(avgHours) },
    { label: "Oldest", value: formatHours(maxHours) },
    { label: "Overdue (>3d)", value: overdue, danger: overdue > 0 },
  ];

  return (
    <div className="card aging-card p-6">
      <div className="card-header mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Approval Aging</h3>
        <span className="text-sm text-gray-500">Pending CREATE requests</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {stats.map((s) => {
          let bgClass = "bg-gray-50 border-gray-100";
          let valueColor = "text-gray-900";
          let labelColor = "text-gray-500";

          if (s.label === "Avg Wait") { bgClass = "bg-blue-50 border-blue-100"; valueColor = "text-blue-700"; labelColor = "text-blue-600"; }
          if (s.label === "Oldest") { bgClass = "bg-amber-50 border-amber-100"; valueColor = "text-amber-700"; labelColor = "text-amber-600"; }
          if (s.label === "Overdue (>3d)" && s.danger) { bgClass = "bg-rose-50 border-rose-100"; valueColor = "text-rose-700"; labelColor = "text-rose-600"; }

          return (
            <div key={s.label} className={`flex flex-col p-4 rounded-xl border ${bgClass} transition-colors`}>
              <span className={`text-xs font-semibold uppercase tracking-wider mb-1 ${labelColor}`}>{s.label}</span>
              <strong className={`text-2xl font-bold ${valueColor}`}>{s.value}</strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}
