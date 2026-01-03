import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ProfileCard from "../../components/profile/ProfileCard";
import CapabilitiesCard from "../../components/profile/CapabilitiesCard";
import TeamCard from "../../components/profile/TeamCard";
import HrInsightsCard from "../../components/profile/HrInsightsCard";

import "../../styles/profile/profileLayout.css";
import "../../styles/profile/hrProfile.css";

const API = process.env.REACT_APP_API_BASE_URL;

export default function HrProfile() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    if (!token) return;

    fetch(`${API}/profile/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => setProfile(d.profile))
      .catch(console.error);
  }, [token]);

  useEffect(() => {
    if (!token) return;

    fetch(`${API}/teams`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => setTeams(d.teams || d))
      .catch(console.error);
  }, [token]);

  if (!profile) return null;

  return (
    <div className="profile-layout hr">
      <ProfileCard profile={profile} />
      <CapabilitiesCard capabilities={profile.capabilities} />
      <HrInsightsCard />
      <TeamCard teams={teams} />
    </div>
  );
}
