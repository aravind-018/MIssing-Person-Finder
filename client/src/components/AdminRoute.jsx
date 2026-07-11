import { Navigate, Outlet } from "react-router-dom";

function AdminRoute() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/officer/dashboard" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;