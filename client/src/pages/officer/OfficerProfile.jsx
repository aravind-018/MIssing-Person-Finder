import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProfileCard from "../../components/profile/ProfileCard";
import { getProfile } from "../../services/authService";

function OfficerProfile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const profile = await getProfile();
      setUser(profile);
    } catch (error) {
      // Error handled silently; UI remains unchanged for user
    }
  }

  return (
    <div className="dashboard-container">
      <h2 className="page-title">
        My Profile
      </h2>

      <ProfileCard
        user={user}
        onChangePassword={() =>
          navigate("/officer/change-password")
        }
      />
    </div>
  );
}

export default OfficerProfile;