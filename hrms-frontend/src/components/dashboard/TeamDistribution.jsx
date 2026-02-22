import "../../styles/dashboard/teamDistribution.css";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";
import AppSpinner from "../common/AppSpinner";

const COLORS = [
  "#6366f1",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#a855f7",
];

export default function TeamDistribution({ employees = [], loading = false }) {
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

  if (loading) {
    return (
      <div className="card team-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Distribution</h3>
        <div className="flex justify-center items-center py-12">
          <AppSpinner />
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="card team-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Distribution</h3>
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg text-center px-6 py-10 min-h-[180px] flex flex-col justify-center items-center transition-all duration-300 opacity-80 hover:opacity-100">
          <PieChartIcon className="w-8 h-8 text-gray-400 mb-3" />
          <h4 className="text-sm font-semibold text-gray-900 mb-1">No Team Distribution</h4>
          <p className="text-xs text-gray-500 max-w-[200px] leading-relaxed">
            Assign employees to teams to visualize distribution.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card team-card p-6">
      <div className="card-header mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Team Distribution</h3>
        <span className="text-sm text-gray-500">Employees per team</span>
      </div>

      <div className="flex items-center justify-center gap-8 mt-4">
        <div className="w-1/2 flex justify-end">
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

        <ul className="flex flex-col gap-3 text-sm font-medium w-1/2">
          {data.map((d, i) => (
            <li key={d.name} className="flex items-center gap-3">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-gray-700 truncate w-24">{d.name}</span>
              <span className="text-gray-400 ml-auto font-bold">{d.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
