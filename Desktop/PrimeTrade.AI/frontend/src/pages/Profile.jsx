import { useEffect, useState } from "react";
import { getProfile } from "../services/api";

import 'bootstrap/dist/css/bootstrap.min.css';
import './Profile.css'; // custom CSS file

export default function Profile() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await getProfile();
      setUser(res.data);
    };
    fetchProfile();
  }, []);

  return (
    <div className="profile-container d-flex justify-content-center align-items-center">
      <div className="profile-card p-4 rounded shadow text-center">
        <h1 className="mb-4">Your Profile</h1>

        <div className="profile-field mb-3">
          <p className="field-label">Name</p>
          <p className="field-value">{user.name || "Loading..."}</p>
        </div>

        <div className="profile-field">
          <p className="field-label">Email</p>
          <p className="field-value">{user.email || "Loading..."}</p>
        </div>
      </div>
    </div>
  );
}
