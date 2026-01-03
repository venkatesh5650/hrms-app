import { differenceInHours } from "date-fns";
import "../../styles/dashboard/approvalAging.css";

export default function ApprovalAging({ approvals }) {
  const now = new Date();

  const pendingCreates = approvals.filter(
    (a) => a.type === "CREATE" && a.status === "PENDING"
  );

  if (pendingCreates.length === 0) {
    return (
      <div className="card aging-card">
        <h3>Approval Aging</h3>
        <p className="success">No pending requests 🎉</p>
      </div>
    );
  }

  const ages = pendingCreates.map((a) =>
    differenceInHours(now, new Date(a.created_at))
  );

  const avgHours = Math.round(ages.reduce((a, b) => a + b, 0) / ages.length);
  const maxHours = Math.max(...ages);
  const overdue = ages.filter((h) => h > 72).length;

  const stats = [
    { label: "Pending", value: pendingCreates.length },
    { label: "Avg Wait", value: `${avgHours}h` },
    { label: "Oldest", value: `${maxHours}h` },
    { label: "Overdue (>3d)", value: overdue, danger: overdue > 0 },
  ];

  return (
    <div className="card aging-card">
      <div className="card-header">
        <h3>Approval Aging</h3>
        <span className="subtitle">Pending CREATE requests</span>
      </div>

      <div className="aging-grid">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`aging-tile ${s.danger ? "danger" : ""}`}
          >
            <span className="aging-label">{s.label}</span>
            <strong className="aging-value">{s.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
