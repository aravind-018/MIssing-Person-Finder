import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import adminMenu from "../config/adminMenu";
import FoundReportNotifications from "../components/FoundReportNotifications";
import "./MainLayout.css";

function AdminLayout() {
  return (
    <div className="main-layout">
      <FoundReportNotifications role="admin" />
      <Sidebar menuItems={adminMenu} />

      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
