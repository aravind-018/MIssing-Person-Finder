import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import "./Sidebar.css";
import ConfirmModal from "./common/ConfirmModal";
import useConfirmModal from "../hooks/useConfirmModal";
import useBranding from "../hooks/useBranding";

function Sidebar({ menuItems }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const branding = useBranding();
  const navigate = useNavigate();
  const location = useLocation();

  // Automatically close mobile menu when navigating
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const {
    confirmModal,
    openConfirmModal,
    closeConfirmModal,
  } = useConfirmModal();

  const handleLogout = () => {
    setMobileOpen(false);
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
      {/* Mobile Top Header (hidden on desktop) */}
      <header className="mobile-header">
        <div className="mobile-header-brand">
          <h1>{branding.systemName || "GodsEye"}</h1>
          <span className="mobile-header-tagline">
            {branding.applicationTagline || "Missing Person Finder"}
          </span>
        </div>
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </header>

      {/* Dimmed backdrop for mobile drawer */}
      <div
        className={`sidebar-backdrop ${mobileOpen ? "open" : ""}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-top">
          <div className="sidebar-header-row">
            <div className="sidebar-logo">
              <h1>{branding.systemName || "GodsEye"}</h1>
              <p>
                {branding.organizationName ? `${branding.organizationName} ` : ""}
                {branding.applicationTagline || "Missing Person Finder"}
              </p>
            </div>
            <button
              type="button"
              className="sidebar-close-btn"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
            >
              <FaTimes />
            </button>
          </div>

          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.path}
                onClick={() => setMobileOpen(false)}
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