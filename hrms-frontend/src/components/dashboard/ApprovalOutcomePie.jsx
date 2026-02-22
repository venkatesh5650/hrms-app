import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#facc15", "#22c55e", "#ef4444"]; // Pending, Approved, Rejected

export default function ApprovalOutcomePie({ pending, approved, rejected }) {
  const data = [
    { name: "Pending", value: pending },
    { name: "Approved", value: approved },
    { name: "Rejected", value: rejected },
  ];

  return (
    <div className="workflow-pie">
      <h4>Outcome Distribution</h4>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <p className="workflow-caption" style={{ fontSize: "0.75rem", color: "#9ca3af", textAlign: "center", marginTop: "8px" }}>Share of approval outcomes</p>
    </div>
  );
}
