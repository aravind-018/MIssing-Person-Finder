import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./MainLayout.css";

function MainLayout() {
  return (
    <div className="main-layout">
      <Sidebar />

      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;