
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useLmsAdmin } from "../../context/LmsAdminContext";

import {
  updateCourseStatus,
  cloneCourse,
  createCategory,
  updateCategory,
  deleteCategory,
  createCoupon,
  exportAdminEnrollments,
} from "../../services/lmsAdminService";

import styles from "./lms.module.css";

const TABS = [
  "Overview",
  "Courses",
  "Orders",
  "Enrollments",
  "Instructors",
  "Categories",
  "Coupons",
];

const INITIAL_CATEGORY_FORM = {
  name: "",
  description: "",
};

const INITIAL_COUPON_FORM = {
  code: "",
  type: "PERCENTAGE",
  value: "",
  maxDiscount: "",
  minPurchase: "",
  usageLimit: "",
  courseId: "",
  expires: "",
};

const getId = (item) => item?._id || item?.id;

const getName = (item) =>
  item?.name || item?.title || "—";

const getDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString();
};

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  "Something went wrong";

const getRows = (item) =>
  Array.isArray(item) ? item : [];

export default function LmsAdmin() {
  const {
    analytics,
    courses,
    orders,
    enrollments,
    instructors,
    categories,
    coupons,
    loading,
    loadAdminData,
    setCourses,
    setCategories,
  } = useLmsAdmin();

  const [activeTab, setActiveTab] = useState("Overview");
  const [updatingId, setUpdatingId] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [creatingCoupon, setCreatingCoupon] = useState(false);

  const [categoryForm, setCategoryForm] = useState(
    INITIAL_CATEGORY_FORM
  );

  const [couponForm, setCouponForm] = useState(
    INITIAL_COUPON_FORM
  );

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const refreshData = async () => {
    try {
      await loadAdminData();
      toast.success("Dashboard refreshed");
    } catch (error) {
      console.error("Dashboard refresh error:", error);
      toast.error(getErrorMessage(error));
    }
  };

  // COURSE STATUS
  const handleStatusChange = async (courseId, status) => {
    try {
      setUpdatingId(courseId);

      await updateCourseStatus(courseId, { status });

      setCourses((previous) =>
        previous.map((course) =>
          getId(course) === courseId
            ? { ...course, status }
            : course
        )
      );

      toast.success("Course status updated");
    } catch (error) {
      console.error("Course status error:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setUpdatingId("");
    }
  };

  // CLONE COURSE
  const handleCloneCourse = async (courseId) => {
    if (!courseId) {
      toast.error("Course ID is missing");
      return;
    }

    try {
      await cloneCourse({ courseId });

      toast.success("Course cloned");
      await loadAdminData();
    } catch (error) {
      console.error("Clone course error:", error);
      toast.error(getErrorMessage(error));
    }
  };

  // CATEGORY FORM
  const handleCategoryChange = (event) => {
    const { name, value } = event.target;

    setCategoryForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCreateCategory = async (event) => {
    event.preventDefault();

    if (!categoryForm.name.trim()) {
      toast.error("Please enter category name");
      return;
    }

    try {
      setCreatingCategory(true);

      await createCategory({
        name: categoryForm.name.trim(),
        description: categoryForm.description.trim(),
      });

      toast.success("Category created");

      setCategoryForm({ ...INITIAL_CATEGORY_FORM });

      await loadAdminData();
    } catch (error) {
      console.error("Create category error:", error);
      console.error("Category API response:", error.response?.data);
      toast.error(getErrorMessage(error));
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleCategoryToggle = async (category) => {
    const categoryId = getId(category);

    if (!categoryId) {
      toast.error("Category ID is missing");
      return;
    }

    try {
      await updateCategory(categoryId, {
        isActive: !category.isActive,
      });

      setCategories((previous) =>
        previous.map((item) =>
          getId(item) === categoryId
            ? { ...item, isActive: !item.isActive }
            : item
        )
      );

      toast.success("Category updated");
    } catch (error) {
      console.error("Update category error:", error);
      toast.error(getErrorMessage(error));
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!categoryId) {
      toast.error("Category ID is missing");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    try {
      await deleteCategory(categoryId);

      setCategories((previous) =>
        previous.filter((item) => getId(item) !== categoryId)
      );

      toast.success("Category deleted");
    } catch (error) {
      console.error("Delete category error:", error);
      toast.error(getErrorMessage(error));
    }
  };

  // COUPON FORM
  const handleCouponChange = (event) => {
    const { name, value } = event.target;

    setCouponForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCreateCoupon = async (event) => {
    event.preventDefault();

    if (creatingCoupon) return;

    const code = couponForm.code.trim();
    const value = Number(couponForm.value);

    if (!code) {
      toast.error("Please enter coupon code");
      return;
    }

    if (
      couponForm.value === "" ||
      !Number.isFinite(value) ||
      value <= 0
    ) {
      toast.error("Please enter a valid coupon value");
      return;
    }

    if (
      couponForm.type === "PERCENTAGE" &&
      value > 100
    ) {
      toast.error("Percentage value cannot exceed 100");
      return;
    }

    const optionalNumber = (field) => {
      if (couponForm[field] === "") return undefined;

      const number = Number(couponForm[field]);

      return Number.isFinite(number) && number >= 0
        ? number
        : null;
    };

    const maxDiscount = optionalNumber("maxDiscount");
    const minPurchase = optionalNumber("minPurchase");
    const usageLimit = optionalNumber("usageLimit");

    if (
      maxDiscount === null ||
      minPurchase === null ||
      usageLimit === null
    ) {
      toast.error("Please enter valid optional numeric values");
      return;
    }

    // Payload uses the field names from your current implementation.
    // Confirm these names against your backend API contract.
    const payload = {
      code,
      type: couponForm.type,
      value,
      ...(maxDiscount !== undefined && { maxDiscount }),
      ...(minPurchase !== undefined && { minPurchase }),
      ...(usageLimit !== undefined && { usageLimit }),
      ...(couponForm.courseId.trim() && {
        courseId: couponForm.courseId.trim(),
      }),
      ...(couponForm.expires && {
        expires: couponForm.expires,
      }),
    };

    console.log("Creating coupon...");
    console.log("Coupon payload:", payload);

    try {
      setCreatingCoupon(true);

      const response = await createCoupon(payload);

      console.log("Coupon created:", response?.data);

      toast.success("Coupon created successfully!");

      setCouponForm({ ...INITIAL_COUPON_FORM });

      await loadAdminData();
    } catch (error) {
      console.error("Coupon creation failed:", error);
      console.error(
        "Coupon API error response:",
        error.response?.data
      );

      toast.error(getErrorMessage(error));
    } finally {
      setCreatingCoupon(false);
    }
  };

  // EXPORT ENROLLMENTS
  const handleExportEnrollments = async () => {
    try {
      const response = await exportAdminEnrollments();

      const blob = new Blob([response.data], {
        type: "text/csv",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "lms-enrollments.csv";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success("Enrollments exported");
    } catch (error) {
      console.error("Export error:", error);
      toast.error(getErrorMessage(error));
    }
  };

  // ANALYTICS
  const statValue = (keys) => {
    for (const key of keys) {
      const value =
        analytics?.[key] ??
        analytics?.data?.[key];

      if (value !== undefined && value !== null) {
        return value;
      }
    }

    return "—";
  };

  // COMMON TABLE
  const renderTable = (
    headers,
    rows,
    renderRow,
    emptyMessage
  ) => (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length > 0 ? (
            rows.map((row, index) => (
              <tr key={getId(row) || index}>
                {renderRow(row)}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length}>
                <div className={styles.empty}>
                  {emptyMessage}
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  // OVERVIEW
  const renderOverview = () => {
    const courseCount = statValue([
      "totalCourses",
      "coursesCount",
    ]);

    const orderCount = statValue([
      "totalOrders",
      "ordersCount",
    ]);

    const enrollmentCount = statValue([
      "totalEnrollments",
      "enrollmentsCount",
    ]);

    const stats = [
      {
        label: "Users",
        value: statValue([
          "totalUsers",
          "usersCount",
          "users",
        ]),
      },
      {
        label: "Courses",
        value:
          courseCount !== "—" ? courseCount : courses.length,
      },
      {
        label: "Orders",
        value:
          orderCount !== "—" ? orderCount : orders.length,
      },
      {
        label: "Enrollments",
        value:
          enrollmentCount !== "—"
            ? enrollmentCount
            : enrollments.length,
      },
      {
        label: "Certificates",
        value: statValue([
          "totalCertificates",
          "certificatesCount",
        ]),
      },
    ];

    return (
      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <div className={styles.statCard} key={stat.label}>
            <p>{stat.label}</p>
            <h2>{stat.value}</h2>
          </div>
        ))}
      </div>
    );
  };

  // COURSES
  const renderCourses = () =>
    renderTable(
      [
        "Name",
        "Description",
        "Price",
        "Tags",
        "Level",
        "Demo URL",
        "Category",
        "Status",
        "Actions",
      ],
      getRows(courses),
      (course) => {
        const courseId = getId(course);

        return (
          <>
            <td>{getName(course)}</td>
            <td className={styles.descriptionCell}>
              {course.description || "—"}
            </td>
            <td>{course.price ?? "—"}</td>
            <td>
              {Array.isArray(course.tags)
                ? course.tags.join(", ")
                : course.tags || "—"}
            </td>
            <td>{course.level || "—"}</td>
            <td>
              {course.demoUrl ? (
                <a
                  href={course.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View demo
                </a>
              ) : (
                "—"
              )}
            </td>
            <td>
              {typeof course.category === "object"
                ? getName(course.category)
                : course.category || "—"}
            </td>
            <td>
              <span className={styles.status}>
                {course.status || "—"}
              </span>
            </td>
            <td>
              <div className={styles.actionGroup}>
                <select
                  value={course.status || "DRAFT"}
                  disabled={
                    !courseId || updatingId === courseId
                  }
                  onChange={(event) =>
                    handleStatusChange(
                      courseId,
                      event.target.value
                    )
                  }
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>

                <button
                  type="button"
                  className={styles.smallButton}
                  onClick={() => handleCloneCourse(courseId)}
                  disabled={!courseId}
                >
                  Clone
                </button>
              </div>
            </td>
          </>
        );
      },
      "No courses found"
    );

  // ORDERS
  const renderOrders = () =>
    renderTable(
      [
        "Order ID",
        "User",
        "Course",
        "Amount",
        "Status",
        "Created At",
      ],
      getRows(orders),
      (order) => (
        <>
          <td>{getId(order) || "—"}</td>
          <td>
            {order.user?.name ||
              order.user?.email ||
              order.userName ||
              order.email ||
              "—"}
          </td>
          <td>
            {order.course?.name ||
              order.course?.title ||
              order.courseName ||
              "—"}
          </td>
          <td>
            {order.amount ??
              order.totalAmount ??
              order.price ??
              "—"}
          </td>
          <td>{order.status || "—"}</td>
          <td>{getDate(order.createdAt)}</td>
        </>
      ),
      "No orders found"
    );

  // ENROLLMENTS
  const renderEnrollments = () => (
    <>
      <div className={styles.toolbar}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={handleExportEnrollments}
        >
          Export CSV
        </button>
      </div>

      {renderTable(
        [
          "User ID",
          "Course ID",
          "Completed",
          "Created At",
          "Enrolled At",
          "Progress",
          "Updated At",
        ],
        getRows(enrollments),
        (enrollment) => (
          <>
            <td>
              {enrollment.user?._id ||
                enrollment.userId ||
                enrollment.user ||
                "—"}
            </td>
            <td>
              {enrollment.course?._id ||
                enrollment.courseId ||
                enrollment.course ||
                "—"}
            </td>
            <td>{enrollment.completed ? "Yes" : "No"}</td>
            <td>{getDate(enrollment.createdAt)}</td>
            <td>{getDate(enrollment.enrolledAt)}</td>
            <td>{enrollment.progress ?? 0}%</td>
            <td>{getDate(enrollment.updatedAt)}</td>
          </>
        ),
        "No enrollments found"
      )}
    </>
  );

  // INSTRUCTORS
  const renderInstructors = () =>
    renderTable(
      [
        "Name",
        "Email",
        "Role",
        "Is Verified",
        "Created At",
        "Updated At",
        "Two Factor Enabled",
      ],
      getRows(instructors),
      (instructor) => (
        <>
          <td>{getName(instructor)}</td>
          <td>{instructor.email || "—"}</td>
          <td>{instructor.role || "—"}</td>
          <td>{instructor.isVerified ? "Yes" : "No"}</td>
          <td>{getDate(instructor.createdAt)}</td>
          <td>{getDate(instructor.updatedAt)}</td>
          <td>
            {instructor.twoFactorEnabled ? "Yes" : "No"}
          </td>
        </>
      ),
      "No instructors found"
    );

  // CATEGORIES
  const renderCategories = () => (
    <>
      <form
        className={styles.form}
        onSubmit={handleCreateCategory}
      >
        <h3>Create Category</h3>

        <div className={styles.formGrid}>
          <input
            name="name"
            value={categoryForm.name}
            onChange={handleCategoryChange}
            placeholder="Category name"
            required
          />

          <input
            name="description"
            value={categoryForm.description}
            onChange={handleCategoryChange}
            placeholder="Description"
          />

          <button
            type="submit"
            className={styles.primaryButton}
            disabled={creatingCategory}
          >
            {creatingCategory
              ? "Creating..."
              : "Create Category"}
          </button>
        </div>
      </form>

      {renderTable(
        [
          "Name",
          "Description",
          "Slug",
          "Is Active",
          "Created At",
          "Updated At",
          "Actions",
        ],
        getRows(categories),
        (category) => {
          const categoryId = getId(category);

          return (
            <>
              <td>{getName(category)}</td>
              <td>{category.description || "—"}</td>
              <td>{category.slug || "—"}</td>
              <td>{category.isActive ? "Yes" : "No"}</td>
              <td>{getDate(category.createdAt)}</td>
              <td>{getDate(category.updatedAt)}</td>
              <td>
                <div className={styles.actionGroup}>
                  <button
                    type="button"
                    className={styles.smallButton}
                    onClick={() =>
                      handleCategoryToggle(category)
                    }
                    disabled={!categoryId}
                  >
                    {category.isActive
                      ? "Deactivate"
                      : "Activate"}
                  </button>

                  <button
                    type="button"
                    className={styles.dangerButton}
                    onClick={() =>
                      handleDeleteCategory(categoryId)
                    }
                    disabled={!categoryId}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </>
          );
        },
        "No categories found"
      )}
    </>
  );

  // COUPONS
  const renderCoupons = () => (
    <>
      <form
        className={styles.form}
        onSubmit={handleCreateCoupon}
      >
        <h3>Create Coupon</h3>

        <div className={styles.formGrid}>
          <input
            name="code"
            type="text"
            value={couponForm.code}
            onChange={handleCouponChange}
            placeholder="Coupon code"
            required
          />

          <select
            name="type"
            value={couponForm.type}
            onChange={handleCouponChange}
          >
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED">Fixed amount</option>
          </select>

          <input
            name="value"
            type="number"
            min="0.01"
            step="any"
            value={couponForm.value}
            onChange={handleCouponChange}
            placeholder="Value"
            required
          />

          <input
            name="maxDiscount"
            type="number"
            min="0"
            step="any"
            value={couponForm.maxDiscount}
            onChange={handleCouponChange}
            placeholder="Max discount"
          />

          <input
            name="minPurchase"
            type="number"
            min="0"
            step="any"
            value={couponForm.minPurchase}
            onChange={handleCouponChange}
            placeholder="Min purchase"
          />

          <input
            name="usageLimit"
            type="number"
            min="0"
            step="1"
            value={couponForm.usageLimit}
            onChange={handleCouponChange}
            placeholder="Usage limit"
          />

          <input
            name="courseId"
            type="text"
            value={couponForm.courseId}
            onChange={handleCouponChange}
            placeholder="Course ID (optional)"
          />

          <label className={styles.dateField}>
            <span>Expires</span>
            <input
              name="expires"
              type="date"
              value={couponForm.expires}
              onChange={handleCouponChange}
            />
          </label>

          <button
            type="submit"
            className={styles.primaryButton}
            disabled={creatingCoupon}
          >
            {creatingCoupon
              ? "Creating Coupon..."
              : "Create Coupon"}
          </button>
        </div>
      </form>

      {renderTable(
        [
          "Code",
          "Type",
          "Value",
          "Max Discount",
          "Min Purchase",
          "Usage Limit",
          "Course ID",
          "Expires",
        ],
        getRows(coupons),
        (coupon) => (
          <>
            <td>{coupon.code || "—"}</td>
            <td>{coupon.type || "—"}</td>
            <td>{coupon.value ?? "—"}</td>
            <td>{coupon.maxDiscount ?? "—"}</td>
            <td>{coupon.minPurchase ?? "—"}</td>
            <td>{coupon.usageLimit ?? "—"}</td>
            <td>{coupon.courseId || "All courses"}</td>
            <td>{getDate(coupon.expires)}</td>
          </>
        ),
        "No coupons found"
      )}
    </>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case "Overview":
        return renderOverview();
      case "Courses":
        return renderCourses();
      case "Orders":
        return renderOrders();
      case "Enrollments":
        return renderEnrollments();
      case "Instructors":
        return renderInstructors();
      case "Categories":
        return renderCategories();
      case "Coupons":
        return renderCoupons();
      default:
        return null;
    }
  };

  return (
    <main className={styles.admin}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>LMS MANAGEMENT</p>
          <h1>Admin Dashboard</h1>
          <p className={styles.subtitle}>
            Manage courses, users, orders and marketplace settings.
          </p>
        </div>

        <button
          type="button"
          className={styles.refreshButton}
          onClick={refreshData}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </header>

      <nav className={styles.tabs}>
        {TABS.map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={
              activeTab === tab
                ? styles.activeTab
                : styles.tab
            }
          >
            {tab}
          </button>
        ))}
      </nav>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>{activeTab}</h2>
          <span>
            {loading
              ? "Loading data..."
              : "Admin workspace"}
          </span>
        </div>

        {loading ? (
          <div className={styles.loading}>
            Loading dashboard data...
          </div>
        ) : (
          renderActiveTab()
        )}
      </section>
    </main>
  );
}
