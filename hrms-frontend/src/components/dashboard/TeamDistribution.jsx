import "../../styles/dashboard/teamDistribution.css";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = [
  "#6366f1",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#a855f7",
];

export default function TeamDistribution({ employees = [] }) {
  // Build team counts from employees[].Teams[]
  const teamMap = {};

  employees.forEach(emp => {
    emp.Teams?.forEach(team => {
      teamMap[team.name] = (teamMap[team.name] || 0) + 1;
    });
  });

  const data = Object.entries(teamMap).map(([name, value]) => ({
    name,
    value,
  }));

  if (!data.length) {
    return (
      <div className="card team-card">
        <h3>Team Distribution</h3>
        <p className="empty">No teams with members yet</p>
      </div>
    );
  }

  return (
    <div className="card team-card">
      <div className="card-header">
        <h3>Team Distribution</h3>
        <span className="subtitle">Employees per team</span>
      </div>

      <div className="team-chart-wrapper">
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className="team-legend">
          {data.map((d, i) => (
            <li key={d.name}>
              <span
                className="legend-color"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="legend-name">{d.name}</span>
              <span className="legend-count">{d.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
