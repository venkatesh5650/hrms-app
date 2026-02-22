import ApprovalOutcomePie from "./ApprovalOutcomePie";

export default function ApprovalPipelineChart({ pending, history }) {
  const approved = history.filter((a) => a.status === "APPROVED").length;
  const rejected = history.filter((a) => a.status === "REJECTED").length;
  const pendingCount = pending.length;

  const total = approved + rejected + pendingCount || 1;

  // ⭐ ENTERPRISE LARGEST-VALUE ROUNDING (84 / 8 / 8 behaviour)
  const rawPending = (pendingCount / total) * 100;
  const rawApproved = (approved / total) * 100;
  const rawRejected = (rejected / total) * 100;

  // Step 1 — base floor values
  let pendingPercent = Math.floor(rawPending);
  let approvedPercent = Math.floor(rawApproved);
  let rejectedPercent = Math.floor(rawRejected);

  // Step 2 — distribute remaining percentage to largest segment
  let remaining =
    100 - (pendingPercent + approvedPercent + rejectedPercent);

  if (remaining > 0) {
    // Largest count absorbs rounding difference (industry behaviour)
    if (approved >= pendingCount && approved >= rejected) {
      approvedPercent += remaining;
    } else if (pendingCount >= rejected) {
      pendingPercent += remaining;
    } else {
      rejectedPercent += remaining;
    }
  }

  let insight = "Workflow is healthy.";
  if (rejected / total > 0.4) insight = "⚠ High rejection rate detected.";
  else if (pendingCount > approved + rejected)
    insight = "⏳ Approval backlog is growing.";

  return (
    <div className="card approval-card">
      <h3>Approval Workflow</h3>

      <div
        className="workflow-summary"
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        <div
          className="workflow-item pending"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <span
            style={{
              fontSize: "0.75rem",
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Pending
          </span>
          <strong
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#eab308",
            }}
          >
            {pendingCount}
          </strong>
        </div>

        <div
          className="workflow-item approved"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <span
            style={{
              fontSize: "0.75rem",
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Approved
          </span>
          <strong
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#16a34a",
            }}
          >
            {approved}
          </strong>
        </div>

        <div
          className="workflow-item rejected"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <span
            style={{
              fontSize: "0.75rem",
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Rejected
          </span>
          <strong
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#dc2626",
            }}
          >
            {rejected}
          </strong>
        </div>
      </div>

      <div
        className="workflow-bars"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        {/* Pending */}
        <div
          className="bar"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "0.875rem",
          }}
        >
          <span style={{ width: "65px", color: "#4b5563", fontWeight: 500 }}>
            Pending
          </span>
          <div
            className="bar-track"
            style={{
              flex: 1,
              height: "8px",
              backgroundColor: "#f3f4f6",
              borderRadius: "99px",
              overflow: "hidden",
            }}
          >
            <div
              className="bar-fill reviewed"
              style={{
                width: `${pendingPercent}%`,
                height: "100%",
                backgroundColor: "#eab308",
                borderRadius: "99px",
              }}
            />
          </div>
          <span
            style={{
              width: "35px",
              textAlign: "right",
              fontWeight: 600,
              color: "#111827",
            }}
          >
            {pendingPercent}%
          </span>
        </div>

        {/* Approved */}
        <div className="bar" style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.875rem" }}>
          <span style={{ width: "65px", color: "#4b5563", fontWeight: 500 }}>
            Approved
          </span>
          <div className="bar-track" style={{ flex: 1, height: "8px", backgroundColor: "#f3f4f6", borderRadius: "99px", overflow: "hidden" }}>
            <div className="bar-fill approved" style={{ width: `${approvedPercent}%`, height: "100%", backgroundColor: "#16a34a", borderRadius: "99px" }} />
          </div>
          <span style={{ width: "35px", textAlign: "right", fontWeight: 600, color: "#111827" }}>
            {approvedPercent}%
          </span>
        </div>

        {/* Rejected */}
        <div className="bar" style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.875rem" }}>
          <span style={{ width: "65px", color: "#4b5563", fontWeight: 500 }}>
            Rejected
          </span>
          <div className="bar-track" style={{ flex: 1, height: "8px", backgroundColor: "#f3f4f6", borderRadius: "99px", overflow: "hidden" }}>
            <div className="bar-fill rejected" style={{ width: `${rejectedPercent}%`, height: "100%", backgroundColor: "#dc2626", borderRadius: "99px" }} />
          </div>
          <span style={{ width: "35px", textAlign: "right", fontWeight: 600, color: "#111827" }}>
            {rejectedPercent}%
          </span>
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