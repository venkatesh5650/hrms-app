import { useEffect, useState } from "react";
import "../../styles/dashboard/teamCard.css";
import { useAuth } from "../../context/AuthContext";
import AppSpinner from "../../components/common/AppSpinner";
import { Users2 } from "lucide-react";

const API = process.env.REACT_APP_API_BASE_URL;

export default function TeamCard({ teams: propTeams = [] }) {
  const { user, token } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const isOverview = user?.role === "ADMIN" || user?.role === "HR";
  const isManager = user?.role === "MANAGER";

  useEffect(() => {
    if (!token) return;

    // Always fetch from /api/teams — the profile API strips member arrays,
    // so propTeams only has { id, name, description } with no count data.
    // The /api/teams endpoint returns full Employees[] arrays needed for counts.
    async function loadTeams() {
      try {
        setLoading(true);
        const res = await fetch(`${API}/teams`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch teams");
        const data = await res.json();
        setTeams(data.teams || data);
      } catch {
        // Fallback to propTeams (no member counts, but at least shows team names)
        console.error("Failed to load teams, falling back to profile data");
        setTeams(propTeams);
      } finally {
        setLoading(false);
      }
    }

    loadTeams();
  }, [token, propTeams, isOverview, isManager]);

  let visibleTeams = teams;
  if (isManager) {
    visibleTeams = teams.filter((t) => t.Employees?.some((e) => e.user_id === user.id));
  } else if (!isOverview && !isManager) {
    visibleTeams = propTeams;
  }

  // Defensive safe teams list — prevents undefined map errors
  const safeTeams = Array.isArray(visibleTeams) ? visibleTeams : [];

  const title = isOverview ? "Team Overview" : isManager ? "Teams Managed" : "Work Teams";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
      {/* Card Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center flex-shrink-0 border border-violet-100">
            <Users2 size={17} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Collaboration units</p>
          </div>
        </div>
        {!loading && safeTeams.length > 0 && (
          <span className="text-[11px] font-bold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-100">
            {safeTeams.length} Active
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="flex-1 px-6 py-5">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <AppSpinner className="h-5 w-5 text-gray-400" />
          </div>
        ) : safeTeams.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3 border border-gray-100">
              <Users2 size={20} className="text-gray-300" />
            </div>
            <p className="text-[13px] font-semibold text-gray-500 mb-1">No Team Assignments</p>
            <p className="text-[12px] text-gray-400 max-w-[180px] leading-relaxed">
              You haven't been assigned to a team yet. Contact HR or your Manager.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {safeTeams.map((t, idx) => (
              <div
                key={t.id ?? idx}
                className="p-3.5 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all duration-200 group"
              >
                <p className="text-[14px] font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors truncate">
                  {t.name}
                </p>
                {t.description && (
                  <p className="text-[12px] text-gray-400 mt-0.5 line-clamp-1">{t.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
