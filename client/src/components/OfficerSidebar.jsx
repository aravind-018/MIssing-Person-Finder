import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUserPlus,
  FaUsers,
  FaUserShield,
  FaVideo,
  FaSearch,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import "./Sidebar.css";
import ConfirmModal from "./common/ConfirmModal";
import useConfirmModal from "../hooks/useConfirmModal";

function Sidebar() {
  const navigate = useNavigate();
  const {
  confirmModal,
  openConfirmModal,
  closeConfirmModal,
} = useConfirmModal();

const handleLogout = () => {
  openConfirmModal({
    title: "Logout",
    message: "Are you sure you want to logout from GodsEye?",
    confirmText: "Logout",
    confirmClass: "delete-btn",

    onConfirm: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      closeConfirmModal();

      navigate("/");
    },
  });
};

  const menuItems = [
  {
    title: "Dashboard",
    icon: <FaHome />,
    path: "/admin/dashboard",
  },
  {
    title: "Register Missing Person",
    icon: <FaUserPlus />,
    path: "/admin/register",
  },
  {
    title: "Manage Missing Persons",
    icon: <FaUsers />,
    path: "/admin/manage-persons",
  },
  {
    title: "Register Officer",
    icon: <FaUserShield />,
    path: "/admin/register-officer",
  },
  {
    title: "Officer Management",
    icon: <FaUserShield />,
    path: "/admin/manage-users",
  },
  {
    title: "Upload Video",
    icon: <FaVideo />,
    path: "/admin/upload",
  },
  {
    title: "Results",
    icon: <FaSearch />,
    path: "/admin/results",
  },
  {
    title: "Settings",
    icon: <FaCog />,
    path: "/admin/settings",
  },
];

return (
  <>
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <h1>GodsEye</h1>
          <p>Missing Person Finder</p>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >
              {item.icon}
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>

    <ConfirmModal
      isOpen={confirmModal.isOpen}
      title={confirmModal.title}
      message={confirmModal.message}
      confirmText={confirmModal.confirmText}
      confirmClass={confirmModal.confirmClass}
      onConfirm={confirmModal.onConfirm}
      onCancel={closeConfirmModal}
    />
  </>
);
}

export default Sidebar;