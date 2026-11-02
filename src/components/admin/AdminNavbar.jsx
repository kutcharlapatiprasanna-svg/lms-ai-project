
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth/login", { replace: true });
  };

  return (
    <header className="admin-navbar">
      <div>
        <h2>Admin Dashboard</h2>
        <p>Manage your application from one place.</p>
      </div>

      <div className="navbar-profile">
        <div className="profile-avatar">
          {(user?.name || user?.email || "A")
            .charAt(0)
            .toUpperCase()}
        </div>

        <div className="profile-details">
          <strong>{user?.name || "Administrator"}</strong>
          <span>{user?.role || "Admin"}</span>
        </div>

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
