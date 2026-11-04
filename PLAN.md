# Skillora Project Plan

## Objective

Maintain a web learning platform with public course discovery, account access, learner-facing course/learning flows, and administration. This objective is inferred from the current routes, pages, state providers, and service modules.

## Existing implementation

The following are present in code; their production readiness and end-to-end behavior have not been independently verified:

- A Vite/React application entry point and React Router route tree.
- Public home, course list, and course-detail routes.
- Registration, account activation, and login pages, with public-route handling.
- Authentication context backed by local storage, protected profile settings, and admin-only route guards.
- A course context and course service for public/admin course lists, details, course content, course mutations, questions, answers, and reviews.
- An LMS area with marketplace, course detail, lecture, learning, and instructor routes; LMS service methods cover marketplace, curriculum, progress, purchases, reviews, wishlists, certificates, payments, instructor, and admin operations.
- Admin routes for overview, users, courses, orders, notifications, analytics, layout, and LMS administration.
- Axios client/interceptors and a direct category `fetch` from the home page.

## Current status and verification limits

- These features and boundaries were verified by reading the route declarations, providers, pages, and API service code.
- The repository has `dev`, `build`, `lint`, and `preview` scripts. No test script or test files were found in the inspected project tree.
- No end-to-end, backend, or deployment behavior is marked complete by this document.

## Architecture

`index.html` → `src/main.jsx` → `BrowserRouter` + `AuthProvider` + `CourseProvider` → `src/app/App.jsx` → `src/routes/AppRoutes.jsx`.

Routes render screen modules in `src/pages/`, shared UI in `src/components/`, and use route guards in `src/routes/`. Shared data is held in React contexts. Most network operations flow through `src/api/axiosInstance.js` into `src/services/`; a direct `fetch` is also present in `src/pages/home/Home.jsx`. Styling is in shared `src/styles/` and page/component CSS files.

## Functional requirements reflected in code

These are code-derived behaviors, not independently accepted product requirements:

1. Visitors can reach the home, course list/detail, and authentication screens.
2. Authenticated users can access profile settings; admin-only routes guard admin dashboards.
3. Learners can access LMS marketplace, course, lecture, and learning routes.
4. Instructor and administrator screens expose LMS-related management areas.
5. Services expose account, course, admin, analytics, layout, order, notification, and LMS API operations.

## Non-functional requirements for future changes

- Preserve existing route, request/response, authentication, and UI behavior unless the task explicitly changes it.
- Keep secrets and personal information out of source, logs, and documentation.
- Reuse existing dependencies and patterns; add dependencies only for an approved requirement.
- Validate changes with the available lint/build scripts and add focused tests if a test framework is adopted.

## Proposed roadmap (pending; not existing commitments)

1. **Confirm behavior and contracts** — document expected user/admin flows and API response/error contracts with the project owner/backend source.
2. **Establish test coverage** — choose and configure an appropriate test approach only after approval; cover route guards, core interactions, and service error states.
3. **Validate end-to-end flows** — run against an agreed backend/test environment and record which registration, course, payment, learning, and admin paths work.
4. **Review security and deployment behavior** — verify server-side authorization, token handling, API targets, and deployment rewrites against authoritative backend/deployment requirements.
5. **Keep project documentation current** — revise plans and architecture notes when confirmed implementation changes land.

## Dependencies and implementation sequence

For any future implementation work, confirm behavior/contracts before changing affected code; add or update targeted tests before or alongside implementation; then run lint/build and any approved integration checks. Backend-dependent flows require a verified backend contract and a safe test environment. These are recommended dependencies, not current project task assignments.

## Validation strategy

- Current available checks: `npm run lint` and `npm run build`.
- No existing automated test suite was found; do not treat lint/build as behavioral verification.
- For future changes, validate the exact routes, forms, API outcomes, permissions, and responsive states affected using approved test data and a non-production environment.

## Future improvements to consider

- Agree on a maintained test strategy and add focused automated coverage.
- Document and verify API contracts and backend authorization behavior.
- Establish explicit handling for API configuration across local and deployed environments.
- Confirm accessibility and responsive behavior against product expectations.

All suggestions above remain proposals until confirmed.
