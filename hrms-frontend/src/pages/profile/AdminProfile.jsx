import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ProfileCard from "../../components/profile/ProfileCard";
import CapabilitiesCard from "../../components/profile/CapabilitiesCard";
import TeamCard from "../../components/profile/TeamCard";
import AdminStatsCard from "../../components/profile/AdminStatsCard";

import "../../styles/profile/profileLayout.css";
import "../../styles/profile/adminProfile.css";

const API = process.env.REACT_APP_API_BASE_URL;

export default function AdminProfile() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    if (!token) return;

    fetch(`${API}/profile/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Unauthorized");
        return r.json();
      })
      .then((d) => setProfile(d.profile))
      .catch((err) => console.error("Failed to load profile:", err));
  }, [token]);

  useEffect(() => {
    if (!token) return;

    fetch(`${API}/teams`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch teams");
        return r.json();
      })
      .then((d) => setTeams(d.teams || d))
      .catch((err) => console.error("Failed to load teams:", err));
  }, [token]);

  if (!profile) return null;

  return (
    <div className="profile-layout admin">
      <ProfileCard profile={profile} />
      <CapabilitiesCard capabilities={profile.capabilities} />
      <AdminStatsCard />
      <TeamCard teams={teams} />
    </div>
  );
}
