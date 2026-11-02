// import axiosInstance from "../api/axiosInstance";
// //import api from "./axios";

// // Create Course
// export const CreateCourseApi = async (payload) => {
//     const { data } = await axiosInstance.post("/course/create-course",payload);
//     return data;
// };

// // Get all public courses
// export const GetCoursesApi = async () => {
//     const { data } = await axiosInstance.get("/course/get-courses");
//     return data;
// };

// // Get all courses for Admin Dashboard
// export const GetAdminCoursesApi = async () => {
//     const { data } = await axiosInstance.get("/course/get-all-course-dashboard");
//     return data;
// };

// // Get single course
// export const GetCourseByIdApi = async (id) => {
//     const { data } = await axiosInstance.get(`/course/get-course/${id}`);
//     return data;
// };

// // Get enrolled course content
// export const GetCourseContentApi = async (id) => {
//     const { data } = await axiosInstance.get(`/course/get-course-content/${id}`);
//     return data;
// };

// // Edit course
// export const EditCourseApi = async (id, payload) => {
//     const { data } = await axiosInstance.put(`/course/edit-course/${id}`, payload);
//     return data;
// };

// // Delete course
// export const DeleteCourseApi = async (id) => {
//     const { data } = await axiosInstance.delete(`/course/delete-course/${id}`);
//     return data;
// };

// // Add question
// export const AddQuestionApi = async (payload) => {
//     const { data } = await axiosInstance.put("/course/add-question",payload);
//     return data;
// };

// // Add answer
// export const AddAnswerApi = async (payload) => {
//     const { data } = await axiosInstance.put("/course/add-answer",payload);
//     return data;
// };

// // Add review
// export const AddReviewApi = async (id, payload) => {
//     const { data } = await axiosInstance.put(`/course/add-review/${id}`,payload);
//     return data;
// };

// // Admin reply to review
// export const AddReplyApi = async (payload) => {
//     const { data } = await axiosInstance.put("/course/add-replay",payload);
//     return data;
// };

import axiosInstance from "../api/axiosInstance";

// Create Course
export const CreateCourseApi = async (payload) => {
  const { data } = await axiosInstance.post(
    "/course/create-course",
    payload
  );
  return data;
};

// Get all public courses
export const GetCoursesApi = async () => {
  const { data } = await axiosInstance.get("/course/get-courses");
  return data;
};

// Get all courses for Admin Dashboard
export const GetAdminCoursesApi = async () => {
  const { data } = await axiosInstance.get(
    "/course/get-all-course-dashboard"
  );
  return data;
};

// Get single course
export const GetCourseByIdApi = async (id) => {
  try {
    console.log("Course ID:", id);

    const { data } = await axiosInstance.get(
      `/course/get-course/${id}`
    );

    console.log("Course Details Response:", data);

    return data;
  } catch (error) {
    console.log("API Status:", error.response?.status);
    console.log("API Error Message:", error.response?.data);
    console.log("API Request URL:", error.config?.url);

    throw error;
  }
};

// Get enrolled course content
export const GetCourseContentApi = async (id) => {
  const { data } = await axiosInstance.get(
    `/course/get-course-content/${id}`
  );
  return data;
};

// Edit course
export const EditCourseApi = async (id, payload) => {
  const { data } = await axiosInstance.put(
    `/course/edit-course/${id}`,
    payload
  );
  return data;
};

// Delete course
export const DeleteCourseApi = async (id) => {
  const { data } = await axiosInstance.delete(
    `/course/delete-course/${id}`
  );
  return data;
};

// Add question
export const AddQuestionApi = async (payload) => {
  const { data } = await axiosInstance.put(
    "/course/add-question",
    payload
  );
  return data;
};

// Add answer
export const AddAnswerApi = async (payload) => {
  const { data } = await axiosInstance.put(
    "/course/add-answer",
    payload
  );
  return data;
};

// Add review
export const AddReviewApi = async (id, payload) => {
  const { data } = await axiosInstance.put(
    `/course/add-review/${id}`,
    payload
  );
  return data;
};

// Admin reply to review
export const AddReplyApi = async (payload) => {
  const { data } = await axiosInstance.put(
    "/course/add-replay",
    payload
  );
  return data;
};
