import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/profile/adminProfile.css";

const API = process.env.REACT_APP_API_BASE_URL;

export default function AdminStatsCard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    async function load() {
      try {
        const res = await fetch(`${API}/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch stats");

        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to load system stats:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token]);

  if (loading) return <div className="card admin-stats loading">Loading stats…</div>;
  if (!stats) return null;

  return (
    <div className="card admin-stats">
      <h3>System Overview</h3>

      {/* Approvals */}
      <div className="stats-section">
        <h4>Approvals</h4>
        <div className="stats-grid">
          {stats.approvals.map((a) => (
            <Stat key={a.status} label={a.status} value={a.count} />
          ))}
        </div>
      </div>

      {/* Average Time */}
      <div className="stats-section">
        <h4>Average Decision Time</h4>
        <div className="single-stat">
          <strong>{Math.round(stats.avgDecisionTimeSeconds / 60)}</strong>
          <span>minutes</span>
        </div>
      </div>

      {/* Top Actors */}
      <div className="stats-section">
        <h4>Top Active Users</h4>
        <div className="stats-list">
          {stats.topActors.map((u) => (
            <div key={u.user_id} className="list-row">
              <span>
                User #{u.user_id}
                {u.role && <small className="user-role"> ({u.role})</small>}
              </span>
              <strong>{u.actions} actions</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
