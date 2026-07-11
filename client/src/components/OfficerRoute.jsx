import { Navigate, Outlet } from "react-router-dom";

function OfficerRoute() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== "officer") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}

export default OfficerRoute;