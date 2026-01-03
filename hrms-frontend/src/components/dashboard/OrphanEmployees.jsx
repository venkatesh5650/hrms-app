import "../../styles/dashboard/orphanEmployees.css";

export default function OrphanEmployees({ employees = [] }) {
  const orphans = employees.filter(
    (e) => !Array.isArray(e.Teams) || e.Teams.length === 0
  );

  return (
    <div className="card orphan-card">
      <div className="card-header">
        <h3>Unassigned Employees</h3>
        <span className="subtitle">Not linked to any team</span>
      </div>

      {orphans.length === 0 ? (
        <p className="success">All employees are assigned 🎉</p>
      ) : (
        <>
          <div className="orphan-count">
            {orphans.length} employee{orphans.length > 1 ? "s" : ""} need
            assignment
          </div>

          <ul className="orphan-list">
            {orphans.map((e) => (
              <li key={e.id} className="orphan-row">
                <span className="orphan-name">
                  {e.first_name} {e.last_name}
                </span>
                <span className="orphan-tag">Unassigned</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
