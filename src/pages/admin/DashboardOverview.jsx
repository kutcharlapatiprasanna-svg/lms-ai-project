
import { useEffect, useState } from "react";
import { fetchAllUsers } from "../../services/adminService";
import "./admin.css";

function normalizeUsers(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.users)) return data.users;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.users)) return data.data.users;
  return [];
}

export default function DashboardOverview() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetchAllUsers()
      .then((data) => {
        if (active) setUsers(normalizeUsers(data));
      })
      .catch((err) => {
        if (active) {
          setError(
            err.response?.data?.message ||
            "Unable to load dashboard statistics."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const admins = users.filter(
    (user) => user.role?.toLowerCase() === "admin"
  ).length;

  const regularUsers = users.filter(
    (user) => user.role?.toLowerCase() !== "admin"
  ).length;

  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="eyebrow">OVERVIEW</span>
          <h1>Welcome to your dashboard</h1>
          <p>Here is a quick summary of your users.</p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="stats-grid">
        <article className="stat-card">
          <div className="stat-icon purple">U</div>
          <p>Total Users</p>
          <h2>{loading ? "..." : users.length}</h2>
          <span>Users returned by the API</span>
        </article>

        <article className="stat-card">
          <div className="stat-icon blue">A</div>
          <p>Administrators</p>
          <h2>{loading ? "..." : admins}</h2>
          <span>Accounts with the admin role</span>
        </article>

        <article className="stat-card">
          <div className="stat-icon green">M</div>
          <p>Other Users</p>
          <h2>{loading ? "..." : regularUsers}</h2>
          <span>Accounts with other roles</span>
        </article>
      </div>

      <div className="welcome-card">
        <div>
          <span className="eyebrow">QUICK START</span>
          <h2>Manage users efficiently</h2>
          <p>
            View user records, open a selected user, and manage
            supported account settings from the sidebar.
          </p>
        </div>
      </div>
    </section>
  );
}
