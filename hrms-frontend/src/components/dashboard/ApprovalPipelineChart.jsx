import ApprovalOutcomePie from "./ApprovalOutcomePie";

export default function ApprovalPipelineChart({ pending, history }) {
  const approved = history.filter((a) => a.status === "APPROVED").length;
  const rejected = history.filter((a) => a.status === "REJECTED").length;
  const pendingCount = pending.length;

  const total = approved + rejected + pendingCount || 1;
  const percent = (n) => Math.round((n / total) * 100);

  let insight = "Workflow is healthy.";
  if (rejected / total > 0.4) insight = "⚠ High rejection rate detected.";
  else if (pendingCount > approved + rejected) insight = "⏳ Approval backlog is growing.";

  return (
    <div className="card approval-card">
      <h3>Approval Workflow</h3>

      <div className="workflow-summary">
        <div className="workflow-item pending">
          <span>Pending</span>
          <strong>{pendingCount}</strong>
        </div>
        <div className="workflow-item approved">
          <span>Approved</span>
          <strong>{approved}</strong>
        </div>
        <div className="workflow-item rejected">
          <span>Rejected</span>
          <strong>{rejected}</strong>
        </div>
      </div>

      <div className="workflow-bars">
        <div className="bar">
          <span>Reviewed</span>
          <div className="bar-track">
            <div className="bar-fill reviewed" style={{ width: `${percent(approved + rejected)}%` }} />
          </div>
          <span>{percent(approved + rejected)}%</span>
        </div>

        <div className="bar">
          <span>Approved</span>
          <div className="bar-track">
            <div className="bar-fill approved" style={{ width: `${percent(approved)}%` }} />
          </div>
          <span>{percent(approved)}%</span>
        </div>

        <div className="bar">
          <span>Rejected</span>
          <div className="bar-track">
            <div className="bar-fill rejected" style={{ width: `${percent(rejected)}%` }} />
          </div>
          <span>{percent(rejected)}%</span>
        </div>
      </div>

      <ApprovalOutcomePie
        pending={pendingCount}
        approved={approved}
        rejected={rejected}
      />

      <div className="workflow-footer">
        <strong>{insight}</strong>
      </div>
    </div>
  );
}
