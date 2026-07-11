import "./ProfileCard.css";
import {
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaIdBadge,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaUserTie,
  FaCalendarAlt,
} from "react-icons/fa";

function ProfileCard({ user, onChangePassword }) {
  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-avatar">
  <FaShieldAlt />
</div>

        <div>
          <h2>{user?.name}</h2>
          <p>{user?.role?.toUpperCase()}</p>
        </div>
      </div>

      <div className="profile-details">

        <div className="profile-item">
  <div className="profile-label">
    <FaEnvelope />
    <label>Email</label>
  </div>

  <span>{user?.email || "-"}</span>
</div>

        <div className="profile-item">
  <div className="profile-label">
    <FaPhone />
    <label>Phone</label>
  </div>

  <span>{user?.phone || "-"}</span>
</div>

        <div className="profile-item">
  <div className="profile-label">
    <FaBuilding />
    <label>Department</label>
  </div>

  <span>{user?.department || "-"}</span>
</div>

        <div className="profile-item">
  <div className="profile-label">
    <FaUserTie />
    <label>Designation</label>
  </div>

  <span>{user?.designation || "-"}</span>
</div>

        <div className="profile-item">
  <div className="profile-label">
    <FaIdBadge />
    <label>Badge Number</label>
  </div>

  <span>{user?.badgeNumber || "-"}</span>
</div>

        <div className="profile-item">
  <div className="profile-label">
    <FaMapMarkerAlt />
    <label>Station</label>
  </div>

  <span>{user?.station || "-"}</span>
</div>

       <div className="profile-item">
  <div className="profile-label">
    <FaMapMarkerAlt />
    <label>District</label>
  </div>

  <span>{user?.district || "-"}</span>
</div>


        <div className="profile-item">
  <div className="profile-label">
    <FaShieldAlt />
    <label>Status</label>
  </div>

  <span
    className={`status-badge ${
      user?.status === "active"
        ? "status-active"
        : "status-inactive"
    }`}
  >
    {user?.status}
  </span>
</div>
<div className="profile-item">
  <div className="profile-label">
    <FaCalendarAlt />
    <label>Joined</label>
  </div>

  <span>
    {user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "-"}
  </span>
</div>
      </div>

      <button
        className="change-password-btn"
        onClick={onChangePassword}
      >
        Change Password
      </button>
    </div>
  );
}

export default ProfileCard;