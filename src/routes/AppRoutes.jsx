
// import { Routes, Route, Navigate } from "react-router-dom";

// import Navbar from "../components/Navbar.jsx";

// import ProtectedRoute from "./ProtectedRoute";
// import PublicRoute from "./PublicRoute";

// // Public pages
// import Home from "../pages/home/Home.jsx";
// import Course from "../pages/courses/Course.jsx";

// // Authentication pages
// import Register from "../pages/auth/Register.jsx";
// import ActivateUser from "../pages/auth/ActivateUser.jsx";
// import Login from "../pages/auth/Login.jsx";

// // Admin dashboard pages
// import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
// import AdminDashboardHome from "../pages/admin/AdminDashboardHome.jsx";
// import GetAllUsers from "../pages/admin/GetAllUsers.jsx";
// import UpdateUser from "../pages/admin/UpdateUser.jsx";
// import CreateCourse from "../pages/admin/CreateCourse.jsx";
// import AllCourses from "../pages/admin/AllCourses.jsx";
// import Orders from "../pages/admin/Orders.jsx";
// import Notifications from "../pages/admin/Notifications.jsx";
// import Analytics from "../pages/admin/Analytics.jsx";
// import SiteLayout from "../pages/admin/SiteLayout.jsx";

// // LMS pages
// import LmsLayout from "../pages/admin/lms/LmsLayout.jsx";
// import LmsHome from "../pages/admin/lms/LmsHome.jsx";
// import LmsCourseDetail from "../pages/admin/lms/LmsCourseDeatils.jsx";
// import LmsLearning from "../pages/admin/lms/LmsLearning.jsx";
// import LmsLecture from "../pages/admin/lms/LmsLecture.jsx";
// import LmsInstructor from "../pages/admin/lms/LmsInstructer.jsx";
// import LmsAdmin from "../pages/admin/LmsAdmin.jsx";

// // LMS Admin Context
// import { LmsAdminProvider } from "../context/LmsAdminContext.jsx";

// export default function AppRoutes() {
//   return (
//     <>
//       <Navbar />

//       <Routes>
//         {/* PUBLIC WEBSITE */}

//         <Route path="/" element={<Home />} />

//         <Route path="/courses" element={<Course />} />

//         {/* COURSE DETAILS */}
//         {/* Course.jsx navigates to /courses/:id */}

//         <Route
//           path="/courses/:id"
//           element={<LmsCourseDetail />}
//         />

//         {/* AUTHENTICATION */}

//         <Route element={<PublicRoute />}>
//           <Route
//             path="/auth/register"
//             element={<Register />}
//           />

//           <Route
//             path="/auth/activate"
//             element={<ActivateUser />}
//           />

//           <Route
//             path="/auth/login"
//             element={<Login />}
//           />
//         </Route>

//         {/* LMS MARKETPLACE */}

//         <Route path="/lms" element={<LmsLayout />}>
//           <Route index element={<LmsHome />} />

//           {/* LMS COURSE DETAILS */}

//           <Route
//             path="course/:courseId"
//             element={<LmsCourseDetail />}
//           />

//           {/* LMS LECTURE */}

//           <Route
//             path="course/:courseId/lecture/:lectureId"
//             element={<LmsLecture />}
//           />

//           {/* MY LEARNING */}

//           <Route
//             path="learning"
//             element={<LmsLearning />}
//           />

//           {/* INSTRUCTOR */}

//           <Route
//             path="instructor"
//             element={<LmsInstructor />}
//           />

//           {/* LMS ADMIN */}

//           <Route
//             path="admin"
//             element={
//               <LmsAdminProvider>
//                 <LmsAdmin />
//               </LmsAdminProvider>
//             }
//           />
//         </Route>

//         {/* ADMIN DASHBOARD */}

//         <Route element={<ProtectedRoute adminOnly />}>
//           <Route
//             path="/admin/admin-dashboard"
//             element={<AdminDashboard />}
//           >
//             <Route
//               index
//               element={<AdminDashboardHome />}
//             />

//             <Route
//               path="all-users"
//               element={<GetAllUsers />}
//             />

//             <Route
//               path="update-user"
//               element={<UpdateUser />}
//             />

//             <Route
//               path="create-course"
//               element={<CreateCourse />}
//             />

//             <Route
//               path="courses"
//               element={<AllCourses />}
//             />

//             <Route
//               path="orders"
//               element={<Orders />}
//             />

//             <Route
//               path="notifications"
//               element={<Notifications />}
//             />

//             <Route
//               path="analytics"
//               element={<Analytics />}
//             />

//             <Route
//               path="layout"
//               element={<SiteLayout />}
//             />
//           </Route>
//         </Route>

//         {/* PAGE NOT FOUND */}

//         <Route
//           path="*"
//           element={<Navigate to="/" replace />}
//         />
//       </Routes>
//     </>
//   );
// }
// import { Routes, Route, Navigate } from "react-router-dom";

// // Components
// import Navbar from "../components/Navbar.jsx";

// // Route protection
// import ProtectedRoute from "./ProtectedRoute.jsx";
// import PublicRoute from "./PublicRoute.jsx";

// // Public Pages
// import Home from "../pages/home/Home.jsx";
// import Course from "../pages/Course.jsx";
// //import CourseDetails from "../pages/CourseDetails.jsx";

// // Authentication Pages
// import Register from "../pages/auth/Register.jsx";
// import ActivateUser from "../pages/auth/ActivateUser.jsx";
// import Login from "../pages/auth/Login.jsx";

// // Profile Pages
// import ProfileSettings from "../pages/profile/ProfileSettings.jsx";

// // LMS Pages
// import LmsLayout from "../pages/lms/LmsLayout.jsx";
// import LmsHome from "../pages/lms/LmsHome.jsx";
// import LmsCourseDetails from "../pages/lms/LmsCourseDetails.jsx";
// import Lecture from "../pages/lms/Lecture.jsx";
// import Learning from "../pages/lms/Learning.jsx";
// import Instructor from "../pages/lms/Instructor.jsx";

// // Admin Pages
// import AdminDashboard from "../pages/admin/AdminDashboard.jsx";

// // Admin Provider
// import { LmsAdminProvider } from "../context/LmsAdminContext.jsx";

// export default function AppRoutes() {
//   return (
//     <>
//       <Navbar />

//       <Routes>
//         {/* Public Pages */}
//         <Route path="/" element={<Home />} />
//         <Route path="/courses" element={<Course />} />
//         {/* <Route path="/courses/:id" element={<CourseDetails />} /> */}

//         {/* Authentication Pages */}
//         <Route element={<PublicRoute />}>
//           <Route path="/auth/register" element={<Register />} />
//           <Route path="/auth/activate" element={<ActivateUser />} />
//           <Route path="/auth/login" element={<Login />} />
//         </Route>

//         {/* Protected Profile Page */}
//         <Route element={<ProtectedRoute />}>
//           <Route
//             path="/profile-settings"
//             element={<ProfileSettings />}
//           />
//         </Route>

//         {/* LMS Pages */}
//         <Route path="/lms" element={<LmsLayout />}>
//           <Route index element={<LmsHome />} />

//           <Route
//             path="course/:id"
//             element={<LmsCourseDetails />}
//           />

//           <Route path="lecture/:id" element={<Lecture />} />
//           <Route path="learning" element={<Learning />} />
//           <Route path="instructor" element={<Instructor />} />
//         </Route>

//         {/* Protected Admin Page */}
//         <Route element={<ProtectedRoute adminOnly />}>
//           <Route
//             path="/admin/admin-dashboard"
//             element={
//               <LmsAdminProvider>
//                 <AdminDashboard />
//               </LmsAdminProvider>
//             }
//           />
//         </Route>

//         {/* Unknown Routes */}
//         <Route
//           path="*"
//           element={<Navigate to="/" replace />}
//         />
//       </Routes>
//     </>
//   );
// }



// import { Routes, Route, Navigate } from "react-router-dom";

// // Navbar
// import Navbar from "../components/Navbar.jsx";

// // Route Protection
// import ProtectedRoute from "./ProtectedRoute.jsx";
// import PublicRoute from "./PublicRoute.jsx";

// // Public Pages
// import Home from "../pages/home/Home.jsx";
// import Course from "../pages/Courses/Course.jsx";

// // Authentication Pages
// import Register from "../pages/auth/Register.jsx";
// import ActivateUser from "../pages/auth/ActivateUser.jsx";
// import Login from "../pages/auth/Login.jsx";

// // Profile
// import ProfileSettings from "../pages/profile/ProfileSettings.jsx";

// // Marketplace
// import LmsMarketPlace from "../pages/marketplace/LmsMarketPlace.jsx";

// // LMS Pages
// import LmsLayout from "../pages/admin/lms/LmsLayout.jsx";
// import LmsHome from "../pages/admin/lms/LmsHome.jsx";
// import LmsCourseDetails from "../pages/admin/lms/LmsCourseDeatils.jsx";
// import LmsInstructor from "../pages/admin/lms/LmsInstructer.jsx";
// import LmsLearning from "../pages/admin/lms/LmsLearning.jsx";
// import LmsLecture from "../pages/admin/lms/LmsLecture.jsx";
// import LmsAdmin from "../pages/admin/lms/LmsAdmin.jsx";

// // Admin Dashboard Pages
// import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
// import AdminDashboardHome from "../pages/admin/AdminDashboardHome.jsx";
// import GetAllUsers from "../pages/admin/GetAllUsers.jsx";
// import UpdateUser from "../pages/admin/UpdateUser.jsx";
// import CreateCourse from "../pages/admin/CreateCourse.jsx";
// import AllCourses from "../pages/admin/AllCourses.jsx";
// import Orders from "../pages/admin/Orders.jsx";
// import Notifications from "../pages/admin/Notifications.jsx";
// import Analytics from "../pages/admin/Analytics.jsx";
// import SiteLayout from "../pages/admin/SiteLayout.jsx";

// // Admin Context
// import { LmsAdminProvider } from "../context/LmsAdminContext.jsx";

// export default function AppRoutes() {
//   return (
//     <>
//       <Navbar />

//       <Routes>
//         {/* ================= PUBLIC ROUTES ================= */}

//         <Route path="/" element={<Home />} />

//         <Route path="/courses" element={<Course />} />

//         {/* ================= AUTH ROUTES ================= */}

//         <Route element={<PublicRoute />}>
//           <Route
//             path="/auth/register"
//             element={<Register />}
//           />

//           <Route
//             path="/auth/activate"
//             element={<ActivateUser />}
//           />

//           <Route
//             path="/auth/login"
//             element={<Login />}
//           />
//         </Route>

//         {/* ================= PROFILE ROUTE ================= */}

//         <Route element={<ProtectedRoute />}>
//           <Route
//             path="/profile-settings"
//             element={<ProfileSettings />}
//           />
//         </Route>

//         {/* ================= LMS MARKETPLACE ================= */}

//         <Route path="/lms" element={<LmsLayout />}>
//           <Route
//             index
//             element={<LmsMarketPlace />}
//           />

//           <Route
//             path="home"
//             element={<LmsHome />}
//           />

//           <Route
//             path="course/:id"
//             element={<LmsCourseDetails />}
//           />

//           <Route
//             path="lecture/:id"
//             element={<LmsLecture />}
//           />

//           <Route
//             path="learning"
//             element={<LmsLearning />}
//           />

//           <Route
//             path="instructor"
//             element={<LmsInstructor />}
//           />
//         </Route>

//         {/* ================= LMS ADMIN ================= */}

//         <Route element={<ProtectedRoute adminOnly />}>
//           <Route
//             path="/lms/admin"
//             element={
//               <LmsAdminProvider>
//                 <LmsAdmin />
//               </LmsAdminProvider>
//             }
//           />
//         </Route>

//         {/* ================= MAIN ADMIN DASHBOARD ================= */}

//         <Route element={<ProtectedRoute adminOnly />}>
//           <Route
//             path="/admin/admin-dashboard"
//             element={
//               <LmsAdminProvider>
//                 <AdminDashboard />
//               </LmsAdminProvider>
//             }
//           >
//             <Route
//               index
//               element={<AdminDashboardHome />}
//             />

//             <Route
//               path="all-users"
//               element={<GetAllUsers />}
//             />

//             <Route
//               path="update-user"
//               element={<UpdateUser />}
//             />

//             <Route
//               path="create-course"
//               element={<CreateCourse />}
//             />

//             <Route
//               path="courses"
//               element={<AllCourses />}
//             />

//             <Route
//               path="orders"
//               element={<Orders />}
//             />

//             <Route
//               path="notifications"
//               element={<Notifications />}
//             />

//             <Route
//               path="analytics"
//               element={<Analytics />}
//             />

//             <Route
//               path="layout"
//               element={<SiteLayout />}
//             />
//           </Route>
//         </Route>

//         {/* ================= UNKNOWN ROUTES ================= */}

//         <Route
//           path="*"
//           element={<Navigate to="/" replace />}
//         />
//       </Routes>
//     </>
//   );
// }



import { Routes, Route, Navigate } from "react-router-dom";

// Navbar
import Navbar from "../components/Navbar.jsx";

// Route Protection
import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicRoute from "./PublicRoute.jsx";

// Public Pages
import Home from "../pages/home/Home.jsx";
import Course from "../pages/Courses/Course.jsx";

// Authentication Pages
import Register from "../pages/auth/Register.jsx";
import ActivateUser from "../pages/auth/ActivateUser.jsx";
import Login from "../pages/auth/Login.jsx";

// Profile
import ProfileSettings from "../pages/profile/ProfileSettings.jsx";

// LMS Pages
import LmsLayout from "../pages/admin/lms/LmsLayout.jsx";
import LmsHome from "../pages/admin/lms/LmsHome.jsx";
import LmsCourseDetails from "../pages/admin/lms/LmsCourseDeatils.jsx";
import LmsInstructor from "../pages/admin/lms/LmsInstructer.jsx";
import LmsLearning from "../pages/admin/lms/LmsLearning.jsx";
import LmsLecture from "../pages/admin/lms/LmsLecture.jsx";
import LmsAdmin from "../pages/admin/lms/LmsAdmin.jsx";

// Admin Dashboard Pages
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminDashboardHome from "../pages/admin/AdminDashboardHome.jsx";
import GetAllUsers from "../pages/admin/GetAllUsers.jsx";
import UpdateUser from "../pages/admin/UpdateUser.jsx";
import CreateCourse from "../pages/admin/CreateCourse.jsx";
import AllCourses from "../pages/admin/AllCourses.jsx";
import Orders from "../pages/admin/Orders.jsx";
import Notifications from "../pages/admin/Notifications.jsx";
import Analytics from "../pages/admin/Analytics.jsx";
import SiteLayout from "../pages/admin/SiteLayout.jsx";

// Admin Context
import { LmsAdminProvider } from "../context/LmsAdminContext.jsx";

export default function AppRoutes() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Course />} />

        {/* AUTHENTICATION ROUTES */}
        <Route element={<PublicRoute />}>
          <Route
            path="/auth/register"
            element={<Register />}
          />

          <Route
            path="/auth/activate"
            element={<ActivateUser />}
          />

          <Route
            path="/auth/login"
            element={<Login />}
          />
        </Route>

        {/* PROFILE ROUTE */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/profile-settings"
            element={<ProfileSettings />}
          />
        </Route>

        {/* LMS MARKETPLACE */}
        <Route path="/lms" element={<LmsLayout />}>
          {/* Original API-based Marketplace */}
          <Route index element={<LmsHome />} />

          {/* Course Details */}
          <Route
            path="course/:courseId"
            element={<LmsCourseDetails />}
          />

          {/* Lecture Details */}
          <Route
            path="course/:courseId/lecture/:lectureId"
            element={<LmsLecture />}
          />

          {/* My Learning */}
          <Route
            path="learning"
            element={<LmsLearning />}
          />

          {/* Instructor Dashboard */}
          <Route
            path="instructor"
            element={<LmsInstructor />}
          />
        </Route>

        {/* LMS ADMIN - SEPARATE ROUTE */}
        <Route element={<ProtectedRoute adminOnly />}>
          <Route
            path="/lms/admin"
            element={
              <LmsAdminProvider>
                <LmsAdmin />
              </LmsAdminProvider>
            }
          />
        </Route>

        {/* MAIN ADMIN DASHBOARD */}
        <Route element={<ProtectedRoute adminOnly />}>
          <Route
            path="/admin/admin-dashboard"
            element={
              <LmsAdminProvider>
                <AdminDashboard />
              </LmsAdminProvider>
            }
          >
            <Route
              index
              element={<AdminDashboardHome />}
            />

            <Route
              path="all-users"
              element={<GetAllUsers />}
            />

            <Route
              path="update-user"
              element={<UpdateUser />}
            />

            <Route
              path="create-course"
              element={<CreateCourse />}
            />

            <Route
              path="courses"
              element={<AllCourses />}
            />

            <Route
              path="orders"
              element={<Orders />}
            />

            <Route
              path="notifications"
              element={<Notifications />}
            />

            <Route
              path="analytics"
              element={<Analytics />}
            />

            <Route
              path="layout"
              element={<SiteLayout />}
            />
          </Route>
        </Route>

        {/* UNKNOWN ROUTES */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </>
  );
}
