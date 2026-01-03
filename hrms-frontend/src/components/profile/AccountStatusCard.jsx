import "../../styles/dashboard/accountStatus.css";

export default function AccountStatusCard({ profile }) {
  const isActive = profile.employee?.is_active;

  return (
    <div className="card status-card">
      <div className="card-header">
        <h3>Account Status</h3>
        <span className={`status-badge ${isActive ? "active" : "inactive"}`}>
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="status-row">
        <span>Status</span>
        <strong className={isActive ? "active" : "inactive"}>
          {isActive ? "Active" : "Inactive"}
        </strong>
      </div>

      <div className="status-row">
        <span>Teams Assigned</span>
        <strong>{profile.teams.length}</strong>
      </div>
    </div>
  );
}
