import { useEffect, useState } from "react";
import "../../styles/dashboard/teamCard.css";
import { useAuth } from "../../context/AuthContext";

const API = process.env.REACT_APP_API_BASE_URL;

export default function TeamCard({ teams: propTeams = [] }) {
  const { user, token } = useAuth();
  const [teams, setTeams] = useState([]);

  const isOverview = user?.role === "ADMIN" || user?.role === "HR";
  const isManager = user?.role === "MANAGER";
  const isEmployee = user?.role === "EMPLOYEE";

  useEffect(() => {
    if (!token) return;

    async function loadTeams() {
      try {
        const res = await fetch(`${API}/teams`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch teams");

        const data = await res.json();
        setTeams(data.teams || data);
      } catch (err) {
        console.error("Failed to load teams");
      }
    }

    loadTeams();
  }, [token]);

  const visibleTeams = isManager
    ? teams.filter((t) =>
        t.Employees?.some((e) => e.user_id === user.id)
      )
    : isOverview
    ? teams
    : propTeams;

  return (
    <div className="card team-card">
      <div className="team-header">
        <div className="team-icon">👥</div>
        <h3>
          {isOverview
            ? "Team Overview"
            : isManager
            ? "Teams I Manage"
            : "My Teams"}
        </h3>
      </div>

      {visibleTeams.length === 0 ? (
        <p className="empty">No teams available</p>
      ) : isOverview ? (
        <div className="team-overview">
          {visibleTeams.map((t) => {
            const count =
              t.membersCount ??
              (Array.isArray(t.Employees) ? t.Employees.length : 0);

            return (
              <div key={t.id} className="team-bar-row">
                <div className="team-bar-info">
                  <strong>{t.name}</strong>
                  {!isEmployee && <span>{count} members</span>}
                </div>

                {!isEmployee && (
                  <div className="team-bar">
                    <div
                      className="team-bar-fill"
                      style={{ width: `${Math.min(count * 10, 100)}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="team-list">
          {visibleTeams.map((t) => {
            const count =
              t.membersCount ??
              (Array.isArray(t.Employees) ? t.Employees.length : 0);

            return (
              <div
                key={t.id}
                className={`team-row ${isManager ? "manager-row" : ""}`}
              >
                <div className="team-info">
                  <strong className="team-name">{t.name}</strong>
                  <span className="team-desc">{t.description}</span>
                </div>

                <div className="team-right">
                  {isManager && <span className="manager-badge">Manager</span>}
                  {!isEmployee && <span className="team-count">{count}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
