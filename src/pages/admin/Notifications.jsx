
import { useEffect, useState } from "react";
import {
  getAllNotifications,
  markNotificationAsRead,
} from "../../services/notificationService";
import "./Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getAllNotifications();

        setNotifications(response.notifications ?? []);
      } catch (err) {
        setError(
          err.response?.data?.message ??
            "Failed to load notifications."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  

  const handleMarkAsRead = async (id) => {
    try {
      setUpdatingId(id);

      await markNotificationAsRead(id);

      setNotifications((previousNotifications) =>
        previousNotifications.map((notification) =>
          notification._id === id
            ? { ...notification, status: "read" }
            : notification
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ??
          "Failed to update notification."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const unreadCount = notifications.filter(
    (notification) =>
      String(notification.status).toLowerCase() === "unread"
  ).length;

  if (loading) {
    return <p>Loading notifications...</p>;
  }

  if (error && notifications.length === 0) {
    return <p>{error}</p>;
  }

  return (
    <div className="notifications-page">
      <h2>Notifications</h2>

      <p>
        {unreadCount} unread of {notifications.length}
      </p>

      {error && <p className="notification-error">{error}</p>}

      {notifications.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => {
            const isRead =
              String(notification.status).toLowerCase() === "read";

            return (
              <div
                className="notification-card"
                key={notification._id}
              >
                <h3>{notification.title}</h3>

                <p>{notification.message}</p>

                <small>
                  {notification.createdAt
                    ? new Date(
                        notification.createdAt
                      ).toLocaleString()
                    : "Date unavailable"}
                </small>

                <div className="notification-action">
                  {isRead ? (
                    <span className="read-status">Read</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        handleMarkAsRead(notification._id)
                      }
                      disabled={updatingId === notification._id}
                    >
                      {updatingId === notification._id
                        ? "Updating..."
                        : "Mark as read"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Notifications;
