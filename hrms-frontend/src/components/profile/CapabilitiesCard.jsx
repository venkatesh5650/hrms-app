import "../../styles/dashboard/capabilitiesCard.css";

function formatLabel(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase());
}

export default function CapabilitiesCard({ capabilities }) {
  return (
    <div className="card capabilities-card">
      <div className="card-header">
        <h3>My Access</h3>
        <span className="subtitle">Your system permissions</span>
      </div>

      <div className="capabilities-list">
        {Object.entries(capabilities).map(([key, value]) => (
          <div key={key} className="capability-row">
            <span className="capability-name">{formatLabel(key)}</span>
            <span className={`capability-badge ${value ? "allowed" : "denied"}`}>
              {value ? "Allowed" : "Not allowed"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
