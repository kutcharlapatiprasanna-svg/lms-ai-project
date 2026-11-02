

import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getUserRole } from "../services/authServices";

export default function ProtectedRoute({ adminOnly = false }) {
  const { token, user } = useAuth();
  const location = useLocation();
  const role = getUserRole(user);

  console.log("ProtectedRoute token exists:", Boolean(token));
  console.log("ProtectedRoute user:", user);
  console.log("ProtectedRoute role:", role);

  if (!token) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (
    adminOnly &&
    role !== "admin" &&
    role !== "administrator"
  ) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Admin access denied</h2>
        <p>Role received: {role || "No role found"}</p>
        <p>Check the browser console for the user object.</p>
      </div>
    );
  }

  return <Outlet />;
}
