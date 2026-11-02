
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateRole } from "../../services/adminService";
import "./admin.css";

export default function UpdateUser() {
    const location = useLocation();
    const navigate = useNavigate();

    const user = location.state?.user;

    const [role, setRole] = useState(user?.role || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function handleCancel() {
        navigate("/admin/admin-dashboard/all-users");
    }

    async function handleUpdate(event) {
        event.preventDefault();

        const userId = user?._id || user?.id;

        if (!userId) {
            setError("User ID is missing. Please select the user again.");
            return;
        }

        if (!role.trim()) {
            setError("Please enter a role.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            await updateRole({
                id: userId,
                role: role.trim(),
            });

            setSuccess("Role updated successfully!");

            navigate("/admin/admin-dashboard/all-users", {
                state: {
                    updatedUserId: userId,
                    updatedRole: role.trim(),
                    refresh: true,
                },
            });
        } catch (err) {
            console.error("Update role error:", err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to update role. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    if (!user) {
        return (
            <div className="admin-page">
                <h1>Update User Role</h1>

                <div className="admin-content-card">
                    <p>
                        User details were not found.
                        Please return to All Users and select Update.
                    </p>

                    <button
                        type="button"
                        className="admin-role-cancel-btn"
                        onClick={handleCancel}
                    >
                        Back to All Users
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page update-user-page">
            <div className="update-user-heading">
                <h1>Update User Role</h1>
                <p>Enter the role you want to assign to this user.</p>
            </div>

            <form
                className="admin-form update-user-form"
                onSubmit={handleUpdate}
            >
                <div className="admin-form-group">
                    <label htmlFor="user-role">Enter Role</label>

                    <input
                        id="user-role"
                        name="role"
                        type="text"
                        value={role}
                        onChange={(event) =>
                            setRole(event.target.value)
                        }
                        placeholder="e.g., React Developer"
                        disabled={loading}
                        required
                    />
                </div>

                {error && (
                    <p className="user-error-message" role="alert">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="user-success-message" role="status">
                        {success}
                    </p>
                )}

                <div className="admin-role-actions">
                    <button
                        type="submit"
                        className="admin-role-save-btn"
                        disabled={
                            loading ||
                            !role.trim() ||
                            role.trim() === (user.role || "")
                        }
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                        type="button"
                        className="admin-role-cancel-btn"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
