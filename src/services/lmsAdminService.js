import axiosInstance from "../api/axiosInstance";

// Analytics
export const getAdminAnalytics = () =>
  axiosInstance.get("/lms/admin/analytics");

// Courses
export const getAdminCourses = () =>
  axiosInstance.get("/lms/admin/courses");

export const updateCourseStatus = (courseId, payload) =>
  axiosInstance.put(
    `/lms/admin/courses/${courseId}/status`,
    payload
  );

export const cloneCourse = (payload) =>
  axiosInstance.post("/lms/courses/clone", payload);

// Orders
export const getAdminOrders = () =>
  axiosInstance.get("/lms/admin/orders");

// Enrollments
export const getAdminEnrollments = () =>
  axiosInstance.get("/lms/admin/enrollments");

export const exportAdminEnrollments = () =>
  axiosInstance.get("/lms/admin/enrollments/export", {
    responseType: "blob",
  });

// Instructors
export const getAdminInstructors = () =>
  axiosInstance.get("/lms/admin/instructors");

// Categories
export const getAllCategories = () =>
  axiosInstance.get("/lms/categories/all");

export const createCategory = (payload) =>
  axiosInstance.post("/lms/categories", payload);

export const updateCategory = (categoryId, payload) =>
  axiosInstance.put(
    `/lms/categories/${categoryId}`,
    payload
  );

export const deleteCategory = (categoryId) =>
  axiosInstance.delete(`/lms/categories/${categoryId}`);

// Coupons
export const getCoupons = () =>
  axiosInstance.get("/lms/coupons");

export const createCoupon = (payload) =>
  axiosInstance.post("/lms/coupons", payload);