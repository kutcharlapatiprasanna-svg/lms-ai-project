import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getUserRole } from "../services/authServices";

export default function PublicRoute() {
  const { isAuthenticated, user } = useAuth();
  const role = getUserRole(user);
  const destination =
    role === "admin" || role === "administrator"
      ? "/admin/admin-dashboard"
      : "/";

  return isAuthenticated ? (
    <Navigate to={destination} replace />
  ) : (
    <Outlet />
  );
}