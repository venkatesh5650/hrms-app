import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/teams/adminTeams.css";

export default function AdminTeams() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    api.get("/teams").then((res) => setTeams(res.data.teams || []));
  }, []);

  return (
    <div className="page admin-teams">
      <div className="teams-header">
        <div>
          <h1>Teams</h1>
          <p className="subtitle">View organizational team structure</p>
        </div>
      </div>

      {teams.length === 0 ? (
        <p className="muted">No teams created yet.</p>
      ) : (
        <div className="team-grid">
          {teams.map((team) => (
            <div key={team.id} className="team-card">
              <div className="team-card-header">
                <h3>{team.name}</h3>
                <span className="team-count">
                  {team.Employees?.length || 0} members
                </span>
              </div>

              <p className="team-desc">
                {team.description || "No description provided"}
              </p>

              <div className="team-manager">
                <span className="label">Manager:</span>{" "}
                {team.manager ? (
                  <span className="manager-pill">
                    {team.manager.first_name} {team.manager.last_name}
                  </span>
                ) : (
                  <span className="not-assigned">Not assigned</span>
                )}
              </div>

              <div className="team-members">
                {team.Employees?.length ? (
                  team.Employees.map((e) => {
                    const isManager = team.manager?.id === e.id;

                    return (
                      <span
                        key={e.id}
                        className={`member-chip ${
                          isManager ? "manager-member" : ""
                        }`}
                      >
                        {e.first_name} {e.last_name}
                        {isManager && (
                          <span className="manager-badge">M</span>
                        )}
                      </span>
                    );
                  })
                ) : (
                  <span className="muted">No members</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
