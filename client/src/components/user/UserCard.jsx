import {
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaMapMarkerAlt,
  FaIdBadge,
  FaUserTie,
  FaCalendarAlt,
  FaShieldAlt,
} from "react-icons/fa";

function UserCard({
  user,
  onApprove,
  onReject,
  onSuspend,
  onReactivate,
  onDelete,
})  {
  const getDepartmentClass = (department) => {
    switch (department) {
      case "Police":
        return "dept-police";
      case "Crime Branch":
        return "dept-crime";
      case "CBI":
        return "dept-cbi";
      case "Cyber Cell":
        return "dept-cyber";
      case "Railway Police":
        return "dept-railway";
      case "Women Cell":
        return "dept-women";
      case "NIA":
        return "dept-nia";
      case "Special Branch":
        return "dept-special";
      default:
        return "dept-default";
    }
  };

  return (
    <div className="user-card">

      <div className="user-card-header">

        <div>
          <h2>{user.name}</h2>

          <p className="designation">
            <FaUserTie /> {user.designation}
          </p>
        </div>

        <span className="status pending">
          Pending
        </span>

      </div>

      <div className="user-info">

        <p>
          <FaShieldAlt />
          <strong>Department:</strong>

          <span className={`department-badge ${getDepartmentClass(user.department)}`}>
            {user.department}
          </span>
        </p>

        <p>
          <FaIdBadge />
          <strong>Office ID:</strong> {user.badgeNumber}
        </p>

        <p>
          <FaBuilding />
          <strong>Station:</strong> {user.station}
        </p>

        <p>
          <FaMapMarkerAlt />
          <strong>District:</strong> {user.district}
        </p>

        <p>
          <FaPhone />
          <strong>Phone:</strong> {user.phone}
        </p>

        <p>
          <FaEnvelope />
          <strong>Email:</strong> {user.email}
        </p>

        <p>
          <FaCalendarAlt />
          <strong>Joined:</strong>{" "}
          {new Date(user.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
})}
        </p>

      </div>

      <div className="user-actions">

  {user.status === "pending" && (
    <>
      <button
        className="approve-btn"
        onClick={() => onApprove(user._id)}
      >
        Approve
      </button>

      <button
        className="reject-btn"
        onClick={() => onReject(user._id)}
      >
        Reject
      </button>
    </>
  )}

  {user.status === "active" && (
    <>
      <button
        className="suspend-btn"
        onClick={() => onSuspend(user._id)}
      >
        Suspend
      </button>

      <button
        className="delete-btn"
        onClick={() => onDelete(user._id)}
      >
        Delete
      </button>
    </>
  )}

  {user.status === "suspended" && (
    <>
      <button
        className="reactivate-btn"
        onClick={() => onReactivate(user._id)}
      >
        Reactivate
      </button>

      <button
        className="delete-btn"
        onClick={() => onDelete(user._id)}
      >
        Delete
      </button>
    </>
  )}

  {user.status === "rejected" && (
    <button
      className="delete-btn"
      onClick={() => onDelete(user._id)}
    >
      Delete
    </button>
  )}

</div>

    </div>
  );
}

export default UserCard;