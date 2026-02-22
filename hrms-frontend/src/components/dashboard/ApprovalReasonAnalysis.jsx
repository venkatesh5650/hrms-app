import "../../styles/dashboard/approvalReasonAnalysis.css";

export default function ApprovalReasonAnalysis({ approvals }) {
  console.log("🔍 Raw approvals:", approvals);

  if (!Array.isArray(approvals)) return null;

  // Only rejected approvals with a reason
  const rejected = approvals.filter(
    (a) => a.status === "REJECTED" && a.rejection_reason
  );

  console.log("🔍 Rejected with reasons:", rejected);

  if (!rejected.length) {
    return (
      <div className="card reason-card p-6">
        <h3 className="text-sm font-bold text-gray-900 mb-2">Rejection Analysis</h3>
        <p className="text-xs text-gray-400 italic">No rejection data available to analyze at this time.</p>
      </div>
    );
  }

  // Group by normalized reason
  const reasonCounts = rejected.reduce((acc, a) => {
    const key = a.rejection_reason.trim().toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  console.log("🔍 Grouped reason counts:", reasonCounts);

  const total = rejected.length;

  const sorted = Object.entries(reasonCounts)
    .map(([reason, count]) => ({
      reason,
      count,
      percent: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  console.log("🔍 Final chart data:", sorted);

  return (
    <div className="card reason-card">
      <div className="card-header">
        <h3>Rejection Reasons</h3>
        <span className="subtitle">Why requests get rejected</span>
      </div>

      <div className="reason-list">
        {sorted.map((r) => (
          <div key={r.reason} className="reason-row">
            <div className="reason-info">
              <span className="reason-text">
                {r.reason.charAt(0).toUpperCase() + r.reason.slice(1)}
              </span>
              <span className="reason-count">
                {r.count} ({r.percent}%)
              </span>
            </div>

            <div className="reason-bar">
              <div
                className="reason-bar-fill"
                style={{ width: `${r.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
