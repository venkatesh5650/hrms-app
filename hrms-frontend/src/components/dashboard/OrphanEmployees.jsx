import { CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import "../../styles/dashboard/orphanEmployees.css";
import AppSpinner from "../common/AppSpinner";
import { useDemoGuard } from "../../hooks/useDemoGuard";

export default function OrphanEmployees({ employees = [], loading = false }) {
  const { DemoModal } = useDemoGuard();

  const orphans = employees.filter(
    (e) => !Array.isArray(e.Teams) || e.Teams.length === 0
  );

  return (
    <div className="card orphan-card p-6">
      <DemoModal />
      <div className="card-header mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Unassigned Employees</h3>
        <span className="text-sm text-gray-500">Not linked to any team</span>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <AppSpinner />
        </div>
      ) : orphans.length === 0 ? (
        <div className="bg-emerald-50 border border-dashed border-emerald-200 rounded-lg text-center px-6 py-10 min-h-[180px] flex flex-col justify-center items-center transition-all duration-300 opacity-80 hover:opacity-100">
          <CheckCircle className="w-8 h-8 text-emerald-500 mb-3" />
          <h4 className="text-sm font-semibold text-emerald-900 mb-1">All Employees Assigned</h4>
          <p className="text-xs text-emerald-600 max-w-[200px] leading-relaxed">
            The workforce is fully structured. No orphaned employees found.
          </p>
        </div>
      ) : (
        <>
          <div className="bg-amber-50 text-amber-700 border-l-4 border-amber-400 p-4 mb-4 mt-2 rounded-r-lg flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{orphans.length} employee{orphans.length > 1 ? "s" : ""} need assignment</span>
            </div>
            <Link
              to="/teams"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold rounded-md transition-all group/cta"
            >
              <span>Manage Assignments</span>
              <ArrowRight size={14} className="group-hover/cta:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <ul className="orphan-list">
            {orphans.map((e) => (
              <li key={e.id} className="orphan-row">
                <span className="orphan-name">
                  {e.first_name} {e.last_name}
                </span>
                <span className="orphan-tag">Unassigned</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
