import { Link } from "react-router-dom";
import {
  FaHome,
  FaUserPlus,
  FaUsers,
  FaVideo,
  FaSearch,
  FaCog,
} from "react-icons/fa";

function Sidebar() {
  return (
    <div
      style={{
        width: "250px",
        height: "100vh",
        backgroundColor: "#111827",
        color: "white",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ color: "#3B82F6", marginBottom: "40px" }}>
        GodsEye
      </h2>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <Link to="/dashboard" style={linkStyle}>
          <FaHome />
          <span>Dashboard</span>
        </Link>

        <Link to="/register" style={linkStyle}>
          <FaUserPlus />
          <span>Register Person</span>
        </Link>

        <Link to="/manage-persons" style={linkStyle}>
          <FaUsers />
          <span>Manage Persons</span>
        </Link>

        <Link to="/upload" style={linkStyle}>
          <FaVideo />
          <span>Upload Video</span>
        </Link>

        <Link to="/results" style={linkStyle}>
          <FaSearch />
          <span>Results</span>
        </Link>

        <Link to="/settings" style={linkStyle}>
          <FaCog />
          <span>Settings</span>
        </Link>
      </nav>
    </div>
  );
}

const linkStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  textDecoration: "none",
  color: "white",
  fontSize: "18px",
};

export default Sidebar;