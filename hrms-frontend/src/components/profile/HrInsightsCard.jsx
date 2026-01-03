import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/profile/hrProfile.css";

const API = process.env.REACT_APP_API_BASE_URL;

export default function HrInsightsCard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!token) return;

    fetch(`${API}/analytics/hr`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(setStats)
      .catch(console.error);
  }, [token]);

  if (!stats) return null;

  return (
    <div className="card hr-insights">
      <h3>People Overview</h3>

      <div className="hr-grid">
        <Insight label="Employees" value={stats.employees} />
        <Insight label="Managers" value={stats.managers} />
        <Insight label="Teams" value={stats.teams} />
        <Insight label="Open Requests" value={stats.pendingApprovals} warn />
      </div>
    </div>
  );
}

function Insight({ label, value, warn }) {
  return (
    <div className={`hr-stat ${warn ? "warn" : ""}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
