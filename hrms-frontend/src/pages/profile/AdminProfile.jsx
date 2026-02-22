import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ProfileCard from "../../components/profile/ProfileCard";
import CapabilitiesCard from "../../components/profile/CapabilitiesCard";
import TeamCard from "../../components/profile/TeamCard";
import AdminStatsCard from "../../components/profile/AdminStatsCard";
import ProfilePageSpinner from "../../components/profile/ProfilePageSpinner";

import "../../styles/profile/profileLayout.css";
import "../../styles/profile/adminProfile.css";

const API = process.env.REACT_APP_API_BASE_URL;

export default function AdminProfile() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [teams, setTeams] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    setIsLoading(true);
    Promise.all([
      fetch(`${API}/profile/me`, { headers: { Authorization: `Bearer ${token}` } }).then(r => {
        if (!r.ok) throw new Error("Unauthorized");
        return r.json();
      }),
      fetch(`${API}/teams`, { headers: { Authorization: `Bearer ${token}` } }).then(r => {
        if (!r.ok) throw new Error("Failed to fetch teams");
        return r.json();
      })
    ])
      .then(([profData, teamsData]) => {
        setProfile(profData.profile);
        setTeams(teamsData.teams || teamsData);
      })
      .catch((err) => console.error("Failed to load admin profile:", err))
      .finally(() => setIsLoading(false));
  }, [token]);

  return (
    <div className="profile-page">
      <div className="flex flex-col gap-1 mb-8 pb-5 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Profile</h1>
        <p className="text-sm text-gray-500 font-medium">Manage your account settings and preferences.</p>
      </div>
      {isLoading ? (
        <ProfilePageSpinner />
      ) : !profile ? (
        <p className="error" style={{ color: "red" }}>Unable to load profile data.</p>
      ) : (
        <div className="profile-layout admin">
          <div className="profile-card">
            <ProfileCard profile={profile} />
          </div>
          <div className="capabilities-card">
            <CapabilitiesCard capabilities={profile.capabilities} />
          </div>
          <div className="admin-stats" style={{ background: 'transparent', border: 'none', padding: 0, boxShadow: 'none' }}>
            <AdminStatsCard />
          </div>
          <div className="team-card">
            <TeamCard teams={teams} />
          </div>
        </div>
      )}
    </div>
  );
}
