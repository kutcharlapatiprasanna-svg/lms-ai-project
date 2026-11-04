# Skillora Project Guide

## Project overview

Skillora is a React single-page learning platform. The code includes public course pages, account registration/login/activation, learner profile settings, an LMS marketplace and learning area, and admin dashboards. This description reflects code structure and declared API calls; it is not a claim that every flow has been runtime-verified.

## Technology stack

- JavaScript and JSX; no TypeScript source was found.
- React 19, React DOM, and React Router DOM 7.
- Vite 8 for development and production builds.
- Axios for most API calls, with some direct `fetch` usage.
- Context API for authentication, courses, and LMS admin data.
- CSS and CSS Modules; `react-hot-toast` and Stripe React packages are also dependencies.
- ESLint is configured for JavaScript/JSX, React Hooks, and React Refresh.

## Architecture and important paths

- `index.html` loads `src/main.jsx`.
- `src/main.jsx` mounts the app inside `BrowserRouter`, `AuthProvider`, and `CourseProvider`.
- `src/app/App.jsx` loads global styles and `src/routes/AppRoutes.jsx`.
- `src/routes/` defines public, authenticated, and admin-only routes.
- `src/pages/` contains home, course, authentication, profile, LMS, and admin screens.
- `src/components/` contains shared navigation and loading components.
- `src/context/`, `src/state-mgmt/`, and `src/hooks/` contain shared state and auth access.
- `src/api/` configures the Axios instance and interceptors; `src/services/` contains API service functions.
- `src/styles/` and component/page CSS files contain styling; `src/assets/` contains static assets.
- Root configuration includes `vite.config.js`, `eslint.config.js`, and `vercel.json`.
- `.vscode/` contains existing editor settings and a launch configuration. `New folder/index.html` is also present, but its relationship to the active Vite entry point was not established; verify its purpose before relying on it.

Read `src/routes/AppRoutes.jsx` before changing navigation, `src/main.jsx` before changing provider setup, and the relevant service plus its callers before changing API behavior.

## Coding and naming conventions

- Follow the style and import conventions of the closest existing `.js`/`.jsx` files; the codebase uses function components and hooks.
- Component/page files generally use PascalCase; hooks use the `use` prefix; service modules use camelCase names.
- Keep page/component styling with its existing CSS or CSS Module where that pattern is already used.
- Keep API transport in the existing `src/api/` and `src/services/` layers where possible. Do not introduce a parallel client or state framework.
- Follow `eslint.config.js`; do not assume a separate formatter or test runner is installed.

## Component, routing, state, and API guidance

- Reuse existing shared components, providers, hooks, and service functions. Keep components focused and preserve established route and layout relationships.
- Use React Hooks only at the top level of function components/custom hooks, and keep effect dependencies accurate.
- For routes, use the existing React Router structure and route guards. Confirm access intent before changing protection or redirects; UI route guards do not replace backend authorization.
- Use existing contexts for shared auth/course/admin state. Keep local UI state local unless it is genuinely shared.
- The configured Axios instance uses `/api/v1`, a 15-second timeout, JSON headers, and request/response interceptors. Most service modules use it. `src/pages/home/Home.jsx` also has a direct category `fetch`; inspect its behavior before altering it.
- Preserve request/response shapes and existing error propagation. Handle user-visible errors in the established page/component flow; do not silently turn API failures into successful results.
- Do not put credentials, tokens, or personal data in source, logs, or documentation. Never expose secrets in errors.

## Forms and styling

- Follow the validation and submission behavior of the specific existing form; do not assume all forms share one validation library.
- Preserve loading, disabled, success, and error states when changing submissions.
- Reuse existing CSS conventions and responsive behavior. Avoid global selectors or broad style changes when a local class is sufficient.

## Testing and validation

- No test files or test script were found during inspection.
- Available package scripts are `npm run lint`, `npm run build`, `npm run dev`, and `npm run preview`.
- Run the smallest relevant existing validation after code changes. Do not claim test coverage that is not present.

## Change discipline

- Inspect the relevant implementation and its callers before editing; preserve current behavior unless a requested change explicitly requires otherwise.
- Make focused changes. Avoid unnecessary dependencies, broad refactors, invented APIs, and undocumented architectural changes.
- For this documentation setup task, create or update only the requested documentation files. Do not edit application source, existing configuration, or dependency files.
- If an API contract, authorization rule, or intended behavior is unclear, record the uncertainty and seek confirmation rather than guessing.
