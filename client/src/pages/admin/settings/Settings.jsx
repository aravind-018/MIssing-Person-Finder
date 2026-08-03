import { Outlet } from "react-router-dom";
import "../../../styles/Settings.css";
import SettingsSidebar from "../../../components/settings/SettingsSidebar";

function Settings() {
  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2 className="page-title">Settings</h2>
        <p className="settings-subtitle">
          Configure how GodsEye looks, detects, alerts, and protects your data.
        </p>
      </div>

      <div className="settings-layout">
        <SettingsSidebar />

        <div className="settings-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Settings;