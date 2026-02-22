import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AppSpinner from "../common/AppSpinner";
import { Activity, Clock, CheckCircle2 } from "lucide-react";

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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <AppSpinner />
      </div>
    );
  }
  if (!stats) return null;

  // Industry Standard Time Formatter
  const formatTime = (seconds) => {
    if (!seconds || seconds === 0) return "0m";

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days >= 1) {
      return `${days}d ${hours}h`;
    }
    if (hours >= 1) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 ring-1 ring-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-6 w-full h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 tracking-tight mb-6 mt-0">System Overview</h3>

      <div className="flex flex-col gap-6 flex-1">
        {/* Approvals */}
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <CheckCircle2 size={14} /> Approvals
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {stats.approvals.map((a) => (
              <Stat key={a.status} label={a.status} value={a.count} />
            ))}
          </div>
        </div>

        {/* Average Time */}
        <div className="pt-2 border-t border-gray-50">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Clock size={14} /> Avg Decision Time
          </h4>
          <div className="text-2xl font-bold text-gray-900">
            {formatTime(stats.avgDecisionTimeSeconds)}
          </div>
        </div>

        {/* Top Actors Section */}
        <div className="pt-2 border-t border-gray-50">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Activity size={14} /> Top Active Users
          </h4>
          <div className="flex flex-col gap-2">
            {stats.topActors.map((u) => (
              <div
                key={u.user_id}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-50 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-100 transition-all"
              >
                <div className="flex items-center gap-3">
                  {/* Avatar Circle */}
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                    U{u.user_id}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">User #{u.user_id}</span>
                    <span className="text-[11px] text-gray-500">{u.role}</span>
                  </div>
                </div>
                <strong className="text-sm text-gray-900 font-semibold">{u.actions} <span className="font-normal text-gray-400 text-xs">actions</span></strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex flex-col p-3 rounded-xl bg-gray-50 border border-gray-100/50">
      <strong className="text-xl font-bold text-gray-900">{value}</strong>
      <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mt-0.5">{label}</span>
    </div>
  );
}
