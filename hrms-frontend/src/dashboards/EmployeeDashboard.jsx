import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import ProfileCard from "../components/profile/ProfileCard";
import TeamCard from "../components/profile/TeamCard";
import AccountStatusCard from "../components/profile/AccountStatusCard";
import AppSpinner from "../components/common/AppSpinner";
import EmployeeAccessInfo from "../components/dashboard/EmployeeAccessInfo";
import SelfServiceActionCard from "../components/dashboard/SelfServiceActionCard";

import "../styles/dashboard/employeeDashboard.css";
import "../styles/dashboardLoader.css";

const API = process.env.REACT_APP_API_BASE_URL;

export default function EmployeeDashboard() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`${API}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);

          // Router Guard: Redirect if employee is inactive
          if (data.profile.role === "EMPLOYEE" && data.profile.employee?.is_active === false) {
            window.location.href = "/login";
          }
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    if (token) load();
  }, [token]);

  const initials = profile?.name
    ? profile.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "–";

  return (
    <div className="min-h-screen bg-[#f8f9fb] p-6 md:p-8">

      {/* ── Identity Banner ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-5 mb-8">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl tracking-tight shadow-sm flex-shrink-0">
            {initials}
          </div>
          <div>
            <h1 className="text-[22px] font-bold text-gray-900 tracking-tight leading-tight">
              {profile?.name ?? "Loading…"}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-[11px] font-semibold rounded-full uppercase tracking-wider border border-indigo-100">
                {profile?.role ?? "Employee"}
              </span>
              <p className="text-[13px] text-gray-400 leading-none">
                Your account is active — manage your profile and collaborate with your team.
              </p>
            </div>
          </div>
        </div>

        {/* Employee ID chip */}
        <div className="hidden sm:flex flex-col items-end gap-0.5 flex-shrink-0">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Employee ID</span>
          <span className="text-sm font-mono font-bold text-gray-700 bg-gray-50 px-3 py-1 rounded-lg border border-gray-200">
            #EMP-{profile?.id?.toString().padStart(4, "0") ?? "----"}
          </span>
        </div>
      </div>

      {/* ── Main Content ── */}
      {loading ? (
        <div className="flex justify-center items-center py-32">
          <AppSpinner />
        </div>
      ) : !profile ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-400 font-medium">Unable to load profile. Please refresh.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">

          {/* Row 1 — 3 equal columns, stretch to equal height */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            <ProfileCard profile={profile} />
            <EmployeeAccessInfo />
            <TeamCard teams={profile.teams} />
          </div>

          {/* Row 2 — Account Status + Self-Service side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            <AccountStatusCard profile={profile} />
            <div className="lg:col-span-2">
              <SelfServiceActionCard />
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
