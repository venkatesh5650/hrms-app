import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import ProfileCard from "../components/profile/ProfileCard";
import TeamCard from "../components/profile/TeamCard";
import CapabilitiesCard from "../components/profile/CapabilitiesCard";
import AccountStatusCard from "../components/profile/AccountStatusCard";
import SupportCard from "../components/profile/SupportCard";

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
        const res = await fetch(`${API}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProfile(data.profile);
      } catch (err) {
        console.error("Failed to load employee profile:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token]);

   if (loading) {
    return (
      <div className="dashboard-loader">
        <div className="loader-card">
          <div className="pulse-ring"></div>
          <h2>HRMS</h2>
          <p>Preparing your Employee dashboard…</p>
        </div>
      </div>
    );
  }
  if (!profile) return <p className="error">Unable to load profile</p>;

  return (
    <div className="employee-dashboard">
      <div className="employee-header">
        <div>
          <h1>My Dashboard</h1>
          <p>
            Welcome back, <strong>{profile.name.split(" ")[0]}</strong> 👋
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        <ProfileCard profile={profile} />
        <AccountStatusCard profile={profile} />
        <TeamCard teams={profile.teams} />
        <CapabilitiesCard capabilities={profile.capabilities} />
        <SupportCard />
      </div>
    </div>
  );
}
