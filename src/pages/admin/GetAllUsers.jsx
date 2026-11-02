
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    fetchAllUsers,
    deleteUser,
} from "../../services/adminService";
import "./admin.css";

export default function GetAllUsers() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        try {
            setLoading(true);
            setError("");

            const response = await fetchAllUsers();

            // Support common API response structures.
            const userList = Array.isArray(response)
                ? response
                : response?.users ??
                  response?.data?.users ??
                  response?.data ??
                  [];

            if (!Array.isArray(userList)) {
                throw new Error("Unexpected users API response.");
            }

            setUsers(userList);
        } catch (err) {
            console.error("Fetch users error:", err);
            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to fetch users."
            );
        } finally {
            setLoading(false);
        }
    }

    function handleUpdate(user) {
        navigate("/admin/admin-dashboard/update-user", {
            state: { user },
        });
    }

    async function handleDelete(userId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmed) return;

        try {
            setError("");
            setMessage("");

            await deleteUser(userId);

            setUsers((previousUsers) =>
                previousUsers.filter(
                    (user) => user._id !== userId
                )
            );

            setMessage("User deleted successfully.");
        } catch (err) {
            console.error("Delete user error:", err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to delete user."
            );
        }
    }

    if (loading) {
        return (
            <div className="admin-users-page">
                <p>⏳ Loading users...</p>
            </div>
        );
    }

    return (
        <div className="admin-users-page">
            <div className="admin-users-heading">
                <div>
                    <h1>👥 All Users</h1>
                    <p>View and manage registered platform users.</p>
                </div>

                <button
                    type="button"
                    className="user-refresh-btn"
                    onClick={loadUsers}
                >
                    🔄 Refresh
                </button>
            </div>

            {message && (
                <p className="user-success-message">
                    ✅ {message}
                </p>
            )}

            {error && (
                <p className="user-error-message">
                    ⚠️ {error}
                </p>
            )}

            <div className="admin-users-summary">
                <span>👤 Total users</span>
                <strong>{users.length}</strong>
            </div>

            <div className="admin-table-container">
                <table className="admin-users-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="user-empty">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            users.map((user, index) => (
                                <tr key={user._id || user.id || user.email}>
                                    <td>{index + 1}</td>

                                    <td>
                                        {user.name || "—"}
                                    </td>

                                    <td>
                                        {user.email || "—"}
                                    </td>

                                    <td>
                                        <span className="user-role-badge">
                                            {user.role || "user"}
                                        </span>
                                    </td>

                                    <td>
                                        <div className="user-action-buttons">
                                            <button
                                                type="button"
                                                className="user-update-btn"
                                                onClick={() =>
                                                    handleUpdate(user)
                                                }
                                            >
                                                ✏️ Update
                                            </button>

                                            <button
                                                type="button"
                                                className="user-delete-btn"
                                                onClick={() =>
                                                    handleDelete(
                                                        user._id || user.id
                                                    )
                                                }
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
