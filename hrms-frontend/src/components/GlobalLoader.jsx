import "../styles/dashboardLoader.css";

export default function GlobalLoader() {
  return (
    <div className="dashboard-loader">
      <div className="loader-card">
        <div className="pulse-ring"></div>
        <h2>HRMS</h2>
        <p>Loading your workspace…</p>
      </div>
    </div>
  );
}
