import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import officerMenu from "../config/officerMenu";
import FoundReportNotifications from "../components/FoundReportNotifications";
import "./MainLayout.css";

function OfficerLayout() {
  return (
    <div className="main-layout">
      <FoundReportNotifications role="officer" />
      <Sidebar menuItems={officerMenu} />

      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
}

export default OfficerLayout;
