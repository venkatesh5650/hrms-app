import { TrendingUp } from "lucide-react";
import "../../styles/dashboard/workforceTrends.css";
import AppSpinner from "../common/AppSpinner";

export default function WorkforceTrends({ employees, loading = false }) {
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
    <div className="card workforce-card p-6">
      <div className="card-header mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Workforce Trends</h3>
        <span className="text-sm text-gray-500">Hiring & exits per month</span>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <AppSpinner />
        </div>
      ) : months.length === 0 ? (
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg text-center px-6 py-10 min-h-[180px] flex flex-col justify-center items-center transition-all duration-300 opacity-80 hover:opacity-100">
          <TrendingUp className="w-8 h-8 text-gray-400 mb-3" />
          <h4 className="text-sm font-semibold text-gray-900 mb-1">No Workforce Activity Yet</h4>
          <p className="text-xs text-gray-500 max-w-[200px] leading-relaxed">
            Hiring and exit trends will appear once employee lifecycle events are recorded.
          </p>
        </div>
      ) : (
        <div className="trend-container">
          {months.map((m) => {
            const h = hires[m] || 0;
            const x = exits[m] || 0;
            const net = h - x;

            return (
              <div key={m} className="trend-row hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors duration-150">
                <div className="trend-cell month">{m}</div>
                <div className="trend-cell">
                  <span>Hired</span>
                  <strong>{h}</strong>
                </div>
                <div className="trend-cell">
                  <span>Exited</span>
                  <strong>{x}</strong>
                </div>
                <div className="trend-cell net flex items-center gap-1.5">
                  <span>Net</span>
                  <strong className={net >= 0 ? "text-green-600" : "text-rose-600"}>
                    {net > 0 ? `+${net}` : net}
                  </strong>
                  {net !== 0 && (
                    <span className={`text-[10px] ${net > 0 ? "text-green-500" : "text-rose-500"}`}>
                      {net > 0 ? "▲" : "▼"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
