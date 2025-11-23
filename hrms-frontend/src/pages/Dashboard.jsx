import React, { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    employees: 0,
    teams: 0,
    recentLogs: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [empRes, teamRes, logRes] = await Promise.all([
          api.get("/employees"),
          api.get("/teams"),
          api.get("/logs"),
        ]);

        setStats({
          employees: empRes.data.employees.length,
          teams: teamRes.data.teams.length,
          recentLogs: logRes.data.logs.slice(0, 5),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">
            Welcome, {user?.name || "Admin"} — quick overview of your HR space.
          </p>
        </div>
      </div>

      <div className="grid grid-3">
        <div className="card stat-card">
          <h3>Total Employees</h3>
          <p className="stat-value">{stats.employees}</p>
        </div>
        <div className="card stat-card">
          <h3>Total Teams</h3>
          <p className="stat-value">{stats.teams}</p>
        </div>
        <div className="card stat-card">
          <h3>Recent Events</h3>
          <p className="stat-value">
            {stats.recentLogs.length ? stats.recentLogs.length : 0}
          </p>
        </div>
      </div>

      <div className="card mt-lg">
        <h3>Recent Activity</h3>
        {stats.recentLogs.length === 0 ? (
          <p className="muted">No recent logs yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Action</th>
                <th>Meta</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentLogs.map((log) => (
                <tr key={log.id}>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                  <td>{log.action}</td>
                  <td>
                    <code className="code-small">
                      {JSON.stringify(log.meta || {})}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
