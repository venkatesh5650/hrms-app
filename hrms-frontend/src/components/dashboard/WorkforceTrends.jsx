import "../../styles/dashboard/workforceTrends.css";

export default function WorkforceTrends({ employees }) {
  const byMonth = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  };

  const hires = {};
  const exits = {};

  employees.forEach((e) => {
    if (!e.created_at) return;

    const hireMonth = byMonth(e.created_at);
    hires[hireMonth] = (hires[hireMonth] || 0) + 1;

    if (e.is_active === false && e.updated_at) {
      const exitMonth = byMonth(e.updated_at);
      exits[exitMonth] = (exits[exitMonth] || 0) + 1;
    }
  });

  const months = Array.from(
    new Set([...Object.keys(hires), ...Object.keys(exits)])
  ).sort();

  return (
    <div className="card workforce-card">
      <div className="card-header">
        <h3>Workforce Trends</h3>
        <span className="subtitle">Hiring & exits per month</span>
      </div>

      {months.length === 0 ? (
        <p className="empty">No workforce data yet</p>
      ) : (
        <div className="trend-container">
          {months.map((m) => {
            const h = hires[m] || 0;
            const x = exits[m] || 0;
            const net = h - x;

            return (
              <div key={m} className="trend-row">
                <div className="trend-cell month">{m}</div>
                <div className="trend-cell">
                  <span>Hired</span>
                  <strong>{h}</strong>
                </div>
                <div className="trend-cell">
                  <span>Exited</span>
                  <strong>{x}</strong>
                </div>
                <div
                  className={`trend-cell net ${
                    net < 0 ? "negative" : "positive"
                  }`}
                >
                  <span>Net</span>
                  <strong>{net > 0 ? `+${net}` : net}</strong>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
