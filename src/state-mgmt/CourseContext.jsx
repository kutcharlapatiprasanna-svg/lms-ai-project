// import { createContext, useCallback, useState } from "react";
// import {   CreateCourseApi,
//   GetCoursesApi,
//   GetAdminCoursesApi,
//   GetCourseByIdApi,
//   GetCourseContentApi,
//   EditCourseApi,
//   DeleteCourseApi,
//   AddQuestionApi,
//   AddAnswerApi,
//   AddReviewApi,
//   AddReplyApi, } from "../services/courseService";



// export const CourseContext = createContext();

// /*
//   NOTE: `loading` is ONLY used for fetching data (list / details / content).
//   Mutations (create, edit, delete, Q&A, reviews) do NOT flip it, otherwise the
//   whole page is replaced by a spinner and typed text / scroll position is lost.
//   Pages track their own "submitting" state for buttons.
// */
// const CourseProvider = ({ children }) => {
//   const [courses, setCourses] = useState([]);
//   const [adminCourses, setAdminCourses] = useState([]);
//   const [course, setCourse] = useState(null);
//   const [courseContent, setCourseContent] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // ---------- fetching (uses loading) ----------

//   const getPublicCourses = async () => {
//     try {
//       setLoading(true);
//       const response = await GetCoursesApi();
//       if (response?.success) setCourses(response.courses || []);
//       return response;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getCourses = async () => {
//     try {
//       setLoading(true);
//       const response = await GetAdminCoursesApi();
//       if (response?.success) setAdminCourses(response.courses || []);
//       return response;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // silent = refresh in the background (no spinner, keeps current course on screen)
//   const getCourseById = useCallback(async (id, { silent = false } = {}) => {
//     try {
//       if (!silent) {
//         setLoading(true);
//         setCourse(null); // never show the previously opened course
//       }
//       const response = await GetCourseByIdApi(id);
//       if (response?.success) setCourse(response.course);
//       return response;
//     } finally {
//       if (!silent) setLoading(false);
//     }
//   }, []);

//   const getCourseContent = useCallback(async (id) => {
//     try {
//       setLoading(true);
//       setCourseContent([]);
//       const response = await GetCourseContentApi(id);
//       if (response?.success) setCourseContent(response.content || []);
//       return response;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // ---------- mutations (no global loading) ----------

//   const createCourse = async (payload) => {
//     const response = await CreateCourseApi(payload);
//     if (response?.success && response?.course) {
//       setAdminCourses((prev) => [...prev, response.course]);
//     }
//     return response;
//   };

//   const editCourse = async (id, payload) => {
//     const response = await EditCourseApi(id, payload);
//     if (response?.success && response?.course) {
//       setCourse(response.course);
//       setAdminCourses((prev) =>
//         prev.map((item) => (item._id === id ? response.course : item)),
//       );
//       setCourses((prev) =>
//         prev.map((item) => (item._id === id ? response.course : item)),
//       );
//     }
//     return response;
//   };

//   const deleteCourse = async (id) => {
//     const response = await DeleteCourseApi(id);
//     if (response?.success) {
//       setAdminCourses((prev) => prev.filter((item) => item._id !== id));
//       setCourses((prev) => prev.filter((item) => item._id !== id));
//     }
//     return response;
//   };

//   const addQuestion = (payload) => AddQuestionApi(payload);
//   const addAnswer = (payload) => AddAnswerApi(payload);
//   const addReview = (id, payload) => AddReviewApi(id, payload);
//   const addReply = (payload) => AddReplyApi(payload);

//   return (
//     <CourseContext.Provider
//       value={{
//         courses,
//         adminCourses,
//         course,
//         courseContent,
//         loading,

//         createCourse,
//         getPublicCourses,
//         getCourses,
//         getCourseById,
//         getCourseContent,

//         editCourse,
//         deleteCourse,

//         addQuestion,
//         addAnswer,
//         addReview,
//         addReply,
//       }}
//     >
//       {children}
//     </CourseContext.Provider>
//   );
// };

// export default CourseProvider;




import {
  createContext,
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  CreateCourseApi,
  GetCoursesApi,
  GetAdminCoursesApi,
  GetCourseByIdApi,
  GetCourseContentApi,
  EditCourseApi,
  DeleteCourseApi,
  AddQuestionApi,
  AddAnswerApi,
  AddReviewApi,
  AddReplyApi,
} from "../services/courseService";

export const CourseContext = createContext(null);

const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [adminCourses, setAdminCourses] = useState([]);
  const [course, setCourse] = useState(null);
  const [courseContent, setCourseContent] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch public courses
  const getPublicCourses = useCallback(async () => {
    setLoading(true);

    try {
      const response = await GetCoursesApi();

      if (response?.success) {
        setCourses(response.courses || []);
      } else {
        setCourses([]);
      }

      return response;
    } catch (error) {
      console.error("Get public courses error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch admin courses
  const getCourses = useCallback(async () => {
    setLoading(true);

    try {
      const response = await GetAdminCoursesApi();

      if (response?.success) {
        setAdminCourses(response.courses || []);
      } else {
        setAdminCourses([]);
      }

      return response;
    } catch (error) {
      console.error("Get admin courses error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch one course by ID
  const getCourseById = useCallback(
    async (id, { silent = false } = {}) => {
      if (!silent) {
        setLoading(true);
        setCourse(null);
      }

      try {
        const response = await GetCourseByIdApi(id);

        if (response?.success) {
          setCourse(response.course || null);
        }

        return response;
      } catch (error) {
        console.error("Get course details error:", error);
        throw error;
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    []
  );

  // Fetch course content
  const getCourseContent = useCallback(async (id) => {
    setLoading(true);
    setCourseContent([]);

    try {
      const response = await GetCourseContentApi(id);

      if (response?.success) {
        setCourseContent(response.content || []);
      }

      return response;
    } catch (error) {
      console.error("Get course content error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create course
  const createCourse = useCallback(async (payload) => {
    const response = await CreateCourseApi(payload);

    if (response?.success && response?.course) {
      setAdminCourses((previous) => [
        ...previous,
        response.course,
      ]);
    }

    return response;
  }, []);

  // Edit course
  const editCourse = useCallback(async (id, payload) => {
    const response = await EditCourseApi(id, payload);

    if (response?.success && response?.course) {
      setCourse(response.course);

      setAdminCourses((previous) =>
        previous.map((item) =>
          item._id === id ? response.course : item
        )
      );

      setCourses((previous) =>
        previous.map((item) =>
          item._id === id ? response.course : item
        )
      );
    }

    return response;
  }, []);

  // Delete course
  const deleteCourse = useCallback(async (id) => {
    const response = await DeleteCourseApi(id);

    if (response?.success) {
      setAdminCourses((previous) =>
        previous.filter((item) => item._id !== id)
      );

      setCourses((previous) =>
        previous.filter((item) => item._id !== id)
      );
    }

    return response;
  }, []);

  // Questions, answers and reviews
  const addQuestion = useCallback(
    (payload) => AddQuestionApi(payload),
    []
  );

  const addAnswer = useCallback(
    (payload) => AddAnswerApi(payload),
    []
  );

  const addReview = useCallback(
    (id, payload) => AddReviewApi(id, payload),
    []
  );

  const addReply = useCallback(
    (payload) => AddReplyApi(payload),
    []
  );

  // Context value
  const contextValue = useMemo(
    () => ({
      courses,
      adminCourses,
      course,
      courseContent,
      loading,

      createCourse,
      getPublicCourses,
      getCourses,
      getCourseById,
      getCourseContent,

      editCourse,
      deleteCourse,

      addQuestion,
      addAnswer,
      addReview,
      addReply,
    }),
    [
      courses,
      adminCourses,
      course,
      courseContent,
      loading,
      createCourse,
      getPublicCourses,
      getCourses,
      getCourseById,
      getCourseContent,
      editCourse,
      deleteCourse,
      addQuestion,
      addAnswer,
      addReview,
      addReply,
    ]
  );

  return (
    <CourseContext.Provider value={contextValue}>
      {children}
    </CourseContext.Provider>
  );
};

export default CourseProvider;
