import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import adminMenu from "../config/adminMenu";
import "./MainLayout.css";

function AdminLayout() {
  return (
    <div className="main-layout">
      <Sidebar menuItems={adminMenu} />

      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;