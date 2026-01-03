export default function ActivityFeed({ logs }) {
  return (
    <div className="activity-card">
      <h3>Recent Activity</h3>
      <ul>
        {logs.map((log) => (
          <li key={log.id}>
            {log.action} — {new Date(log.timestamp).toLocaleTimeString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
