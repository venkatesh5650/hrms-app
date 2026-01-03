import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ProfileCard from "../../components/profile/ProfileCard";
import AccountStatusCard from "../../components/profile/AccountStatusCard";
import TeamCard from "../../components/profile/TeamCard";

import "../../styles/profile/profileLayout.css";
import "../../styles/profile/managerProfile.css";

const API = process.env.REACT_APP_API_BASE_URL;

export default function ManagerProfile() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!token) return;

    fetch(`${API}/profile/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load profile");
        return r.json();
      })
      .then((d) => setProfile(d.profile))
      .catch(console.error);
  }, [token]);

  if (!profile) return null;

  return (
    <div className="profile-layout manager">
      <ProfileCard profile={profile} />
      <AccountStatusCard profile={profile} />
      <TeamCard teams={profile.teams} />
    </div>
  );
}
