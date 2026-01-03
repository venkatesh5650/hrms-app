export default function KpiGrid({ data }) {
  const approved =
    data.approvals.find((a) => a.status === "APPROVED")?.count || 0;
  const rejected =
    data.approvals.find((a) => a.status === "REJECTED")?.count || 0;

  const topActor = data.topActors?.[0];

  // Trend logic
  const approvedTrend = approved >= rejected ? "up" : "down";
  const rejectedTrend = rejected > approved ? "up" : "down";

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
      <div className="kpi-card">
        <div className="kpi-label">Approved Requests</div>
        <div className="kpi-value">
          {approved} <Trend direction={approvedTrend} />
        </div>
        <div className="kpi-sub">Compared to rejections</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-label">Rejected Requests</div>
        <div className="kpi-value">
          {rejected} <Trend direction={rejectedTrend} />
        </div>
        <div className="kpi-sub">Compared to approvals</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-label">Avg Processing Time</div>
        <div className="kpi-value">
          {data.avgDecisionTimeSeconds || 0}s
        </div>
        <div className="kpi-sub">Last 30 days</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-label">Top Actor</div>
        <div className="kpi-value">
          {topActor ? (
            <>
              User #{topActor.user_id}
              <span
                style={{
                  marginLeft: 6,
                  fontSize: "0.75rem",
                  color: "#6b7280",
                  fontWeight: 500,
                }}
              >
                ({topActor.role})
              </span>
            </>
          ) : (
            "-"
          )}
        </div>
        <div className="kpi-sub">
          {topActor ? `${topActor.actions} actions · last 7 days` : "No activity yet"}
        </div>
      </div>
    </div>
  );
}
