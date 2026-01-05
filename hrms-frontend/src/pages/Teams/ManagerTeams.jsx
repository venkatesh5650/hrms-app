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

  const myTeams = teams.filter(
    (team) => Number(team.manager?.user_id) === Number(user.id)
  );

  return (
    <div className="manager-teams">
      <header className="manager-header">
        <h1>My Teams</h1>
        <p className="subtitle">Manage your teams and view assigned members</p>
      </header>

      {myTeams.length === 0 ? (
        <p className="empty-state">No teams assigned to you yet.</p>
      ) : (
        <div className="teams-list">
          {myTeams.map((team) => {
            const isOpen = activeTeamId === team.id;

            return (
              <div key={team.id} className={`team-card ${isOpen ? "open" : ""}`}>
                <div className="team-top">
                  <div>
                    <h3>{team.name}</h3>
                    <p className="desc">{team.description || "No description"}</p>
                    <span className="meta">
                      {team.Employees?.length || 0} members • Created{" "}
                      {new Date(team.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <button
                    className="toggle-btn"
                    onClick={() =>
                      setActiveTeamId(isOpen ? null : team.id)
                    }
                  >
                    {isOpen ? "Hide" : "View"}
                  </button>
                </div>

                {isOpen && (
                  <div className="team-members">
                    {team.Employees?.length ? (
                      <table>
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
            );
          })}
        </div>
      )}
    </div>
  );
}
