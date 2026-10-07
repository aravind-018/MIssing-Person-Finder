import { NavLink, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

import "./Sidebar.css";
import ConfirmModal from "./common/ConfirmModal";
import ThemeToggle from "./common/ThemeToggle";
import useConfirmModal from "../hooks/useConfirmModal";
import useBranding from "../hooks/useBranding";

function Sidebar({ menuItems }) {
  const branding = useBranding();
  const navigate = useNavigate();

  const {
    confirmModal,
    openConfirmModal,
    closeConfirmModal,
  } = useConfirmModal();

  const handleLogout = () => {
    openConfirmModal({
      title: "Logout",
      message: `Are you sure you want to logout from ${branding.systemName || "GodsEye"}?`,
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

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-header-row">
            <div className="sidebar-logo">
              <h1>{branding.systemName || "GodsEye"}</h1>
              <p>
                {branding.organizationName ? `${branding.organizationName} ` : ""}
                {branding.applicationTagline || "Missing Person Finder"}
              </p>
            </div>
          </div>

          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "sidebar-link active" : "sidebar-link"
                }
              >
                {item.icon}
                <span>{item.title}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-theme-wrapper">
            <ThemeToggle />
          </div>

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