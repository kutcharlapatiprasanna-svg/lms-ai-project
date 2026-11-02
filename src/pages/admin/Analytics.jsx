
import { useEffect, useState } from "react";
import {
  getUsersAnalytics,
  getCourseAnalytics,
  getOrderAnalytics,
} from "../../services/analyticsService";
import "./Analytics.css";

function Analytics() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [userData, courseData, orderData] =
          await Promise.all([
            getUsersAnalytics(),
            getCourseAnalytics(),
            getOrderAnalytics(),
          ]);

        setUsers(userData.users?.last12Months ?? []);

        setCourses(
          courseData.courses?.last12Months ?? []
        );

        setOrders(
          orderData.orders?.last12Months ?? []
        );
      } catch (err) {
        setError(
          err.response?.data?.message ??
            "Failed to load analytics."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const userTotal = users.reduce(
    (total, item) => total + item.count,
    0
  );

  const courseTotal = courses.reduce(
    (total, item) => total + item.count,
    0
  );

  const orderTotal = orders.reduce(
    (total, item) => total + item.count,
    0
  );

  if (loading) {
    return <p>Loading analytics...</p>;
  }

  if (error) {
    return <p className="analytics-error">{error}</p>;
  }

  return (
    <div className="analytics-page">
      <div className="analytics-heading">
        <div>
          <h2>Analytics</h2>
          <p>Overview of your LMS platform</p>
        </div>
        <span>Last 12 months</span>
      </div>

      <div className="analytics-cards">
        <div className="analytics-card users-card">
          <p>User signups</p>
          <h3>{userTotal}</h3>
        </div>

        <div className="analytics-card courses-card">
          <p>Courses created</p>
          <h3>{courseTotal}</h3>
        </div>

        <div className="analytics-card orders-card">
          <p>Orders</p>
          <h3>{orderTotal}</h3>
        </div>
      </div>

      <AnalyticsChart
        title="User signups (last 12 months)"
        data={users}
        color="blue"
      />

      <AnalyticsChart
        title="Courses created (last 12 months)"
        data={courses}
        color="green"
      />

      <AnalyticsChart
        title="Orders (last 12 months)"
        data={orders}
        color="purple"
      />
    </div>
  );
}

function AnalyticsChart({ title, data, color }) {
  const maxCount = Math.max(
    ...data.map((item) => item.count),
    1
  );

  return (
    <section className="analytics-chart">
      <h3>{title}</h3>

      {data.length === 0 ? (
        <p className="no-data">No data yet.</p>
      ) : (
        <div className="chart-bars">
          {data.map((item, index) => (
            <div className="chart-column" key={`${item.month}-${index}`}>
              <span className="bar-count">
                {item.count}
              </span>

              <div className="bar-area">
                <div
                  className={`chart-bar ${color}`}
                  style={{
                    height: `${
                      (item.count / maxCount) * 100
                    }%`,
                  }}
                  title={`${item.month}: ${item.count}`}
                />
              </div>

              <span className="bar-month">
                {item.month?.split(" ")[0] ?? ""}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Analytics;
