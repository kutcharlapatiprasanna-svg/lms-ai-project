
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { getAllOrders } from "../../services/orderService";
import { fetchAllUsers } from "../../services/adminService";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const results = await Promise.allSettled([
          getAllOrders(),
          fetchAllUsers(),
          axiosInstance.get("/course/get-all-course-dashboard"),
        ]);

        const getList = (response, key) => {
          const root = response?.data ?? response;

          if (Array.isArray(root)) {
            return root;
          }

          const list =
            root?.[key] ??
            root?.data?.[key] ??
            root?.data;

          return Array.isArray(list) ? list : [];
        };

        if (results[0].status === "rejected") {
          throw results[0].reason;
        }

        const orderList = getList(results[0].value, "orders");

        const userList =
          results[1].status === "fulfilled"
            ? getList(results[1].value, "users")
            : [];

        const courseList =
          results[2].status === "fulfilled"
            ? getList(results[2].value, "courses")
            : [];

        setOrders(orderList);
        setUsers(userList);
        setCourses(courseList);

        console.log("Orders:", orderList);
        console.log("Users:", userList);
        console.log("Courses:", courseList);

        if (results[1].status === "rejected") {
          console.error("Users API failed:", results[1].reason);
        }

        if (results[2].status === "rejected") {
          console.error("Courses API failed:", results[2].reason);
        }
      } catch (err) {
        console.error("Orders fetch error:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Extract an ID from either a string or an object.
  const getId = (value) => {
    if (value === null || value === undefined) {
      return "";
    }

    if (typeof value === "object") {
      return String(
        value._id ??
          value.id ??
          value.userId ??
          value.courseId ??
          ""
      );
    }

    return String(value);
  };

  // Get payment details.
  const getPaymentInfo = (order) =>
    order.payment_info ??
    order.paymentInfo ??
    order.payment ??
    {};

  // Find the course name for each order.
  const getCourseName = (order) => {
    const orderCourse = order.course ?? order.courseId;

    // Course details may already be populated in the order.
    if (orderCourse && typeof orderCourse === "object") {
      const name =
        orderCourse.name ??
        orderCourse.courseName ??
        orderCourse.title;

      if (name) {
        return name;
      }
    }

    // Otherwise, match the course ID with the courses list.
    const courseId = getId(
      order.courseId ?? order.course_id
    );

    const matchedCourse = courses.find((course) => {
      const id = getId(
        course._id ?? course.id ?? course.courseId
      );

      return id && courseId && id === courseId;
    });

    return (
      matchedCourse?.name ??
      matchedCourse?.courseName ??
      matchedCourse?.title ??
      order.courseName ??
      order.courseTitle ??
      "Course not found"
    );
  };

  // Find the user name for each order.
  const getUserName = (order) => {
    const orderUser = order.user ?? order.userId;

    // User details may already be populated in the order.
    if (orderUser && typeof orderUser === "object") {
      const name =
        orderUser.name ??
        orderUser.fullName ??
        orderUser.username ??
        orderUser.email;

      if (name) {
        return name;
      }
    }

    // Otherwise, match the user ID with the users list.
    const userId = getId(
      order.userId ?? order.user_id
    );

    const matchedUser = users.find((user) => {
      const id = getId(
        user._id ?? user.id ?? user.userId
      );

      return id && userId && id === userId;
    });

    if (matchedUser) {
      return (
        matchedUser.name ??
        matchedUser.fullName ??
        matchedUser.username ??
        matchedUser.email ??
        "Name unavailable"
      );
    }

    // Use an available fallback if the user ID did not match.
    return (
      order.userName ??
      order.userEmail ??
      "User not found"
    );
  };

  const succeededOrders = orders.filter((order) => {
    const payment = getPaymentInfo(order);

    return (
      String(
        payment.status ?? order.paymentStatus ?? ""
      ).toLowerCase() === "succeeded"
    );
  }).length;

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p>Error loading orders: {error}</p>;
  }

  return (
    <div className="orders-page">
      <h2>All Orders</h2>

      <div className="orders-summary">
        <div>
          <h3>Total Orders</h3>
          <p>{orders.length}</p>
        </div>

        <div>
          <h3>Payment Succeeded</h3>
          <p>{succeededOrders}</p>
        </div>
      </div>

      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Course</th>
              <th>User</th>
              <th>Payment</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5">No orders found.</td>
              </tr>
            ) : (
              orders.map((order, index) => {
                const payment = getPaymentInfo(order);

                return (
                  <tr
                    key={order._id ?? order.id ?? index}
                  >
                    <td>
                      {order._id ?? order.id ?? "—"}
                    </td>

                    <td>{getCourseName(order)}</td>

                    <td>{getUserName(order)}</td>

                    <td>
                      <span className="payment-status">
                        {payment.status ??
                          order.paymentStatus ??
                          "Unknown"}
                      </span>

                      <div>
                        {payment.id ??
                          payment._id ??
                          order.paymentId ??
                          "—"}
                      </div>
                    </td>

                    <td>
                      {order.createdAt || order.created_at
                        ? new Date(
                            order.createdAt ??
                              order.created_at
                          ).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;
