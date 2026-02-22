import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import ProfilePageSpinner from "../../components/profile/ProfilePageSpinner";
import "../../styles/profile/profileLayout.css";

const API = process.env.REACT_APP_API_BASE_URL;

export default function HrProfile() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    setIsLoading(true);
    Promise.all([
      fetch(`${API}/profile/me`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API}/teams`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
    ])
      .then(([profData, teamsData]) => {
        setProfile(profData.profile);
        setTeams(teamsData.teams || teamsData);
      })
      .catch((err) => console.error("Failed to load HR profile:", err))
      .finally(() => setIsLoading(false));
  }, [token]);

  const teamStats = useMemo(() => {
    if (!teams || teams.length === 0) return { totalEmployees: 0, teamsData: [] };

    let totalEmployees = 0;
    const teamsData = teams.map(t => {
      const count = t.membersCount ?? (Array.isArray(t.Employees) ? t.Employees.length : 0);
      totalEmployees += count;
      return { ...t, count };
    });

    return { totalEmployees, teamsData };
  }, [teams]);

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="profile-header mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Profile</h1>
        </div>
        <ProfilePageSpinner />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <p className="error text-red-500 font-medium">Unable to load profile data.</p>
      </div>
    );
  }

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const statusColor = profile.is_demo ? "bg-yellow-400" : "bg-emerald-500";
  const lastLogin = new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }); // Mocked or fetched

  // Permission badges
  const renderBadge = (isAllowed) => (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${isAllowed ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20" : "bg-gray-100 text-gray-500 ring-1 ring-inset ring-gray-400/20"}`}>
      {isAllowed ? "ALLOWED" : "RESTRICTED"}
    </span>
  );



  return (
    <div className="profile-page pb-12">
      <div className="profile-header mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Main Profile Info & Permissions */}
        <div className="lg:col-span-2 space-y-6">

          {/* SECTION 1 — PROFILE HEADER (IDENTITY CARD) */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-shadow hover:shadow-md">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-50 to-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-3xl shadow-inner border border-indigo-200">
                  {initials}
                </div>
                <div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-4 border-white ${statusColor}`} title={profile.is_demo ? "Demo User" : "Active"}></div>
              </div>
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">{profile.name}</h2>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-bold uppercase tracking-wider rounded-md">
                    {profile.role}
                  </span>
                  <div className="flex items-center text-sm text-gray-600 font-medium">
                    <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    Human Resources
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2 font-medium">Human Resources Operator</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-sm border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8 w-full md:w-auto">
              <div>
                <span className="block text-gray-500 mb-0.5">Last Login</span>
                <strong className="text-gray-900 font-semibold">{lastLogin}</strong>
              </div>
              <div>
                <span className="block text-gray-500 mb-0.5">Access Level</span>
                <strong className="text-gray-900 font-semibold">Operational HR</strong>
              </div>
              <div>
                <span className="block text-gray-500 mb-0.5">Email</span>
                <strong className="text-gray-900 font-semibold">{profile.email}</strong>
              </div>
            </div>
          </div>

          {/* SECTION 2 — PERMISSIONS PANEL */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">System Permissions</h3>

            <div className="space-y-8">
              {/* Operational Permissions */}
              <div>
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Operational Permissions</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <span className="text-sm font-semibold text-gray-800">View Employees</span>
                    {renderBadge(profile.capabilities?.viewEmployees !== false)}
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <span className="text-sm font-semibold text-gray-800">Manage Employees</span>
                    {renderBadge(profile.capabilities?.manageEmployees !== false)}
                  </div>
                  <div className="flex items-center justify-between pb-3">
                    <span className="text-sm font-semibold text-gray-800">Manage Teams</span>
                    {renderBadge(profile.capabilities?.manageTeams !== false)}
                  </div>
                </div>
              </div>

              {/* Governance Permissions */}
              <div>
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Governance Permissions</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <span className="text-sm font-semibold text-gray-800">Approve Employees</span>
                    {renderBadge(profile.capabilities?.approveRequests !== false)}
                  </div>
                  <div className="flex items-center justify-between pb-3">
                    <span className="text-sm font-semibold text-gray-800">Approve Login</span>
                    {renderBadge(profile.capabilities?.approveLogin !== false)}
                  </div>
                </div>
              </div>

              {/* Security Permissions */}
              <div>
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Security Permissions</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3">
                    <span className="text-sm font-semibold text-gray-800">View Logs</span>
                    {renderBadge(profile.capabilities?.viewLogs !== false)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3 — TEAM OVERVIEW */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">
              Team Overview
            </h3>

            <div className="space-y-1">
              {teamStats.teamsData.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No teams managed currently.
                </p>
              ) : (
                teamStats.teamsData.map((t, index) => {

                  let percentage = 0;

                  if (teamStats.totalEmployees > 0) {

                    // ✅ LAST TEAM gets remaining percentage
                    if (index === teamStats.teamsData.length - 1) {
                      const used = teamStats.teamsData
                        .slice(0, -1)
                        .reduce((sum, team) => {
                          return (
                            sum +
                            Math.round(
                              (team.count / teamStats.totalEmployees) * 100
                            )
                          );
                        }, 0);

                      percentage = Math.max(0, 100 - used);

                    } else {
                      percentage = Math.round(
                        (t.count / teamStats.totalEmployees) * 100
                      );
                    }
                  }

                  return (
                    <div
                      key={t.id}
                      className="group flex items-center justify-between py-2.5 px-3 rounded-lg border border-transparent hover:bg-gray-50 hover:border-gray-100 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between w-[35%] min-w-[160px] pr-4">
                        <strong className="text-sm font-semibold text-gray-900 truncate pr-2">
                          {t.name}
                        </strong>

                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[11px] font-bold rounded-md whitespace-nowrap">
                          {t.count} {t.count === 1 ? "Member" : "Members"}
                        </span>
                      </div>

                      <div className="flex-1 px-4 hidden sm:block">
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-700 group-hover:from-indigo-600 group-hover:to-emerald-400"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>

                      <div className="w-12 text-right">
                        <span className="text-sm font-bold text-gray-700">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Industry Widgets */}
        <div className="space-y-6">

          {/* Role Scope Widget */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4 tracking-tight border-b border-gray-100 pb-3">Role Scope</h3>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Managed Teams</span>
                  <strong className="text-lg font-bold text-gray-900">{teams.length}</strong>
                </div>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
              </div>
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Employee Access</span>
                  <strong className="text-lg font-bold text-gray-900">Global Read/Write</strong>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                </div>
              </div>
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Approval Permissions</span>
                  <strong className="text-lg font-bold text-gray-900">Standard Tier</strong>
                </div>
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              </div>
            </div>
          </div>

          {/* HR Responsibilities Widget */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" /></svg>
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-4 tracking-tight border-b border-gray-100 pb-3 relative z-10">HR Responsibilities</h3>
            <ul className="space-y-3 relative z-10">
              <li className="flex items-start text-sm text-gray-700 font-medium">
                <span className="mr-2 text-indigo-500 mt-0.5">•</span>
                Employee lifecycle management
              </li>
              <li className="flex items-start text-sm text-gray-700 font-medium">
                <span className="mr-2 text-indigo-500 mt-0.5">•</span>
                Team coordination & organization
              </li>
              <li className="flex items-start text-sm text-gray-700 font-medium">
                <span className="mr-2 text-indigo-500 mt-0.5">•</span>
                Approval workflows processing
              </li>
              <li className="flex items-start text-sm text-gray-700 font-medium">
                <span className="mr-2 text-indigo-500 mt-0.5">•</span>
                Operational audit tracking
              </li>
              <li className="flex items-start text-sm text-gray-700 font-medium">
                <span className="mr-2 text-indigo-500 mt-0.5">•</span>
                Onboarding & identity provisioning
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
