import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import officerMenu from "../config/officerMenu";
import "./MainLayout.css";

function OfficerLayout() {
  return (
    <div className="main-layout">
      <Sidebar menuItems={officerMenu} />

      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
}

export default OfficerLayout;