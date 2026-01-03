import "../../styles/dashboard/approvalStatusSummary.css";

export default function ApprovalStatusSummary({ pending = 0, approved = 0, rejected = 0 }) {
  return (
    <div className="card status-card">
      <div className="card-header">
        <h3>My Requests</h3>
        <span className="subtitle">Your approval outcomes</span>
      </div>

      <div className="status-grid">
        <div className="status-item pending">
          <span className="label">Pending</span>
          <strong>{pending}</strong>
        </div>

        <div className="status-item approved">
          <span className="label">Approved</span>
          <strong>{approved}</strong>
        </div>

        <div className="status-item rejected">
          <span className="label">Rejected</span>
          <strong>{rejected}</strong>
        </div>
      </div>
    </div>
  );
}
