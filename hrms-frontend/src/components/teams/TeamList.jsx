export default function TeamList({ teams, role, onAssignToggle, onEdit, onDelete }) {
  const canEdit = role === "HR";
  const canAssign = role === "HR" || role === "MANAGER";

  return (
    <div className="team-list">
      {teams.map(team => (
        <div key={team.id} className="team-card">
          <div className="team-card-header">
            <div>
              <h3>{team.name}</h3>
              <p className="muted">{team.description || "No description"}</p>
              <span className="tag">{team.Employees?.length || 0} members</span>
            </div>

            <div className="team-card-actions">
              {canEdit && <button onClick={() => onEdit(team)}>Edit</button>}
              {canEdit && <button onClick={() => onDelete(team.id)}>Delete</button>}
              {canAssign && <button onClick={() => onAssignToggle(team.id)}>Manage Members</button>}
            </div>
          </div>

          {canAssign && team.showAssign && (
            <div className="team-members">
              {team.Employees?.length ? (
                team.Employees.map(e => (
                  <div key={e.id} className="member-chip">
                    {e.first_name} {e.last_name}
                  </div>
                ))
              ) : (
                <p className="muted">No members assigned</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
