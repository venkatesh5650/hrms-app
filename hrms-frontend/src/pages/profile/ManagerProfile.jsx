import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ProfileCard from "../../components/profile/ProfileCard";
import AccountStatusCard from "../../components/profile/AccountStatusCard";
import TeamCard from "../../components/profile/TeamCard";
import ProfilePageSpinner from "../../components/profile/ProfilePageSpinner";

import "../../styles/profile/profileLayout.css";
import "../../styles/profile/managerProfile.css";

const API = process.env.REACT_APP_API_BASE_URL;

export default function ManagerProfile() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    setIsLoading(true);
    fetch(`${API}/profile/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load profile");
        return r.json();
      })
      .then((d) => setProfile(d.profile))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [token]);

  return (
    <div className="profile-page">
      <div className="profile-header" style={{ marginBottom: "24px" }}>
        <h1>My Profile</h1>
      </div>
      {isLoading ? (
        <ProfilePageSpinner />
      ) : !profile ? (
        <p className="error" style={{ color: "red" }}>Unable to load profile data.</p>
      ) : (
        <div className="profile-layout manager">
          <ProfileCard profile={profile} />
          <AccountStatusCard profile={profile} />
          <TeamCard teams={profile.teams} />
        </div>
      )}
    </div>
  );
}
