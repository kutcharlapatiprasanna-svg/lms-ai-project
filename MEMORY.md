# Skillora Project Memory

## Purpose and stack

Skillora is a React/Vite learning platform. The repository uses JavaScript/JSX, React 19, React Router 7, Axios, Context API, CSS, `react-hot-toast`, and Stripe React packages. No TypeScript source or test framework was found during inspection.

## Architecture and observed patterns

- Entry: `index.html` → `src/main.jsx` → `src/app/App.jsx` → `src/routes/AppRoutes.jsx`.
- Root providers: `AuthProvider` and `CourseProvider`; admin routes additionally mount `LmsAdminProvider`.
- Shared request client: `src/api/axiosInstance.js` uses `/api/v1`; an interceptor reads `authToken` from local storage. The Vite proxy and Vercel rewrite target `https://mockapi-mauve.vercel.app`.
- Most backend calls are defined in `src/services/`; `src/pages/home/Home.jsx` also fetches LMS categories directly.
- Auth context stores `authToken` and `authUser`; route guards are client-side checks.

## Route areas present

Public: `/`, `/courses`, `/courses/:id`; auth: `/auth/register`, `/auth/activate`, `/auth/login`; protected profile: `/profile-settings`; LMS: `/lms`, `/lms/course/:courseId`, `/lms/course/:courseId/lecture/:lectureId`, `/lms/learning`, `/lms/instructor`; admin-only: `/lms/admin` and `/admin/admin-dashboard` with nested user, course, order, notification, analytics, and layout pages. Unknown routes redirect to `/`.

## API paths declared by service code

All paths below are client-side path strings in `src/services/`, not independently verified backend routes. Variable segments are shown in braces.

- Auth/users: `/auth/register`, `/auth/activate-user`, `/auth/login`, `/auth/update-user-info`, `/auth/get-all-user-dashboard`, `/auth/update-user-roles`, `/auth/delete-user/{id}`.
- Courses: `/course/create-course`, `/course/get-courses`, `/course/get-all-course-dashboard`, `/course/get-course/{id}`, `/course/get-course-content/{id}`, `/course/edit-course/{id}`, `/course/delete-course/{id}`, `/course/add-question`, `/course/add-answer`, `/course/add-review/{id}`, `/course/add-replay`.
- Analytics: `analytics/get-users-analytics` (declared without a leading slash), `/analytics/get-course-analytics`, `/analytics/get-order-analytics`.
- Layout, orders, notifications: `/layout/get-layout`, `/layout/create-layout`, `/layout/update-layout`, `/order/create-order`, `/order/get-all-order-dashboard`, `/notifications/get-all-notification`, `/notifications/update-notification-status/{id}`.
- LMS marketplace and course content: `/lms/home`, `/lms/courses`, `/lms/search`, `/lms/courses/{courseId}`, `/lms/categories`, `/lms/courses/{courseId}/curriculum`, `/lms/courses/{courseId}/sections`, `/lms/sections/{sectionId}`, `/lms/sections/{sectionId}/lectures`, `/lms/lectures/{lectureId}`, `/lms/lectures/{lectureId}/access`, `/lms/lectures/{lectureId}/progress`, `/lms/lectures/{lectureId}/complete`.
- LMS learner, commerce, and content: `/lms/my-learning`, `/lms/enrollments`, `/lms/enrollments/{id}`, `/lms/progress-analytics`, `/lms/purchases`, `/lms/orders`, `/lms/orders/{id}`, `/lms/wishlist`, `/lms/wishlist/toggle`, `/lms/reviews/{courseId}`, `/lms/coupons/validate`, `/lms/certificates`, `/lms/certificates/{id}`, `/lms/certificates/{id}/download`.
- LMS payments and instructor: `/lms/payments/create`, `/lms/payments/verify`, `/lms/payments/refund`, `/lms/instructor/courses`, `/lms/instructor/courses/{courseId}`, `/lms/instructor/courses/{courseId}/lectures`, `/lms/instructor/courses/{courseId}/submit`, `/lms/instructor/students`, `/lms/instructor/revenue`, `/lms/instructor/analytics`.
- LMS admin: `/lms/admin/analytics`, `/lms/admin/courses`, `/lms/admin/courses/{courseId}/status`, `/lms/admin/instructors`, `/lms/admin/orders`, `/lms/admin/enrollments`, `/lms/admin/enrollments/export`, `/lms/courses/clone`, `/lms/admin/courses` (also used by admin service), `/lms/categories/all`, `/lms/categories`, `/lms/categories/{id}`, `/lms/categories/{categoryId}`, `/lms/coupons`.

The LMS service mentions `/lms/payments/webhook` as a backend-only Stripe callback; the frontend does not call it.

## Known gaps and pending work

- No automated test files or `test` script were found; available scripts are `lint`, `build`, `dev`, and `preview`.
- Backend contracts, end-to-end flows, and deployment behavior have not been verified as part of this documentation review.
- No prior development decisions or conversations were available to record. Suggested work remains in `PLAN.md` and is not an existing commitment.
- No secrets, tokens, or personal information are intentionally recorded here.

Update this file only when significant implementation or architecture decisions change, and verify any endpoint/status statement against source before revising it.
