import "../../styles/dashboard/accountStatus.css";
import { Activity, Briefcase, Users2 } from "lucide-react";

export default function AccountStatusCard({ profile }) {
  const teamCount = profile.teams?.length ?? 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
      {/* Card Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-100">
            <Activity size={17} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">Account Status</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Current standing</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-600 border border-emerald-200">
          Active
        </span>
      </div>

      {/* Card Body */}
      <div className="flex flex-col gap-5 px-6 py-5 flex-1">
        {/* Stat Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <Briefcase size={12} className="text-gray-400" />
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Type</span>
            </div>
            <p className="text-[14px] font-semibold text-emerald-700 pl-0.5">Full-Time</p>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <Users2 size={12} className="text-gray-400" />
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Teams</span>
            </div>
            <p className="text-[14px] font-semibold text-gray-800 pl-0.5">
              {teamCount.toString().padStart(2, "0")} Assigned
            </p>
          </div>
        </div>

        {/* Online Status */}
        <div className="flex items-center gap-2.5 px-4 py-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          <p className="text-[13px] font-semibold text-emerald-700">Online Now</p>
          <p className="text-[12px] text-emerald-600 ml-auto">Session active</p>
        </div>
      </div>
    </div>
  );
}
