import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "../../styles/teams/managerTeams.css";

export default function ManagerTeams() {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [activeTeamId, setActiveTeamId] = useState(null);

  useEffect(() => {
    api.get("/teams").then((res) => setTeams(res.data.teams || []));
  }, []);

  const myTeams = teams.filter((team) => team.manager?.user_id === user.id);

  return (
    <div className="manager-teams">
      <header className="manager-header">
        <h1>My Teams</h1>
        <p className="subtitle">Teams you manage and their members</p>
      </header>

      {myTeams.length === 0 ? (
        <p className="empty-state">
          You are not assigned as a manager to any team yet.
        </p>
      ) : (
        <div className="team-grid">
          {myTeams.map((team) => (
            <div key={team.id} className="team-card-wrap">
              <div className="team-card">
                <div className="team-card-header">
                  <div className="team-info">
                    <h3>{team.name}</h3>
                    <p className="team-desc">
                      {team.description || "No description"}
                    </p>
                    <div className="meta-row">
                      <span className="pill">
                        {team.Employees?.length || 0} members
                      </span>
                      <span className="created">
                        Created:{" "}
                        {new Date(team.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <button
                    className="btn secondary"
                    onClick={() =>
                      setActiveTeamId(activeTeamId === team.id ? null : team.id)
                    }
                  >
                    {activeTeamId === team.id ? "Hide Members" : "View Members"}
                  </button>
                </div>

                {activeTeamId === team.id && (
                  <div className="members-panel">
                    {team.Employees?.length ? (
                      <table className="members-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Joined</th>
                          </tr>
                        </thead>
                        <tbody>
                          {team.Employees.map((emp) => (
                            <tr key={emp.id}>
                              <td>
                                {emp.first_name} {emp.last_name}
                              </td>
                              <td>{emp.email}</td>
                              <td>
                                {new Date(emp.created_at).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="muted">No members assigned.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
