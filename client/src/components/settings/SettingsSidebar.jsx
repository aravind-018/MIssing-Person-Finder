import { NavLink } from "react-router-dom";
import {
  FaSlidersH,
  FaRobot,
  FaVideo,
  FaBell,
  FaShieldAlt,
  FaDatabase,
  FaServer,
  FaHistory,
} from "react-icons/fa";

import "./SettingsSidebar.css";

const SECTIONS = [
  { title: "General", path: "general", icon: <FaSlidersH /> },
  { title: "AI Settings", path: "ai", icon: <FaRobot /> },
  { title: "Camera", path: "camera", icon: <FaVideo /> },
  { title: "Notifications", path: "notifications", icon: <FaBell /> },
  { title: "Security", path: "security", icon: <FaShieldAlt /> },
  { title: "Backup", path: "backup", icon: <FaDatabase /> },
  { title: "System Info", path: "system-info", icon: <FaServer /> },
  { title: "Activity Logs", path: "activity-logs", icon: <FaHistory /> },
];

function SettingsSidebar() {
  return (
    <nav className="settings-sidebar">
      {SECTIONS.map((section) => (
        <NavLink
          key={section.path}
          to={section.path}
          className={({ isActive }) =>
            isActive ? "settings-sidebar-link active" : "settings-sidebar-link"
          }
        >
          {section.icon}
          <span>{section.title}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default SettingsSidebar;