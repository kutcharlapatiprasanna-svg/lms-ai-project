# Reusable AI Coding Guidelines

These guidelines describe how to work within the current JavaScript/React project. They are recommendations for future tasks, not claims that every pattern is already uniform.

## React development

- **When to use:** Any UI or application behavior change.
- **Recommended approach:** Inspect the existing page/component and its callers; reuse the current functional-component and provider patterns.
- **Coding standards:** Preserve JSX conventions, imports, and existing user-visible behavior.
- **Common mistakes:** Rebuilding existing shared UI, changing behavior while doing a visual-only task, or introducing a new state/UI library without need.
- **Best practices:** Keep changes focused and validate with the available lint/build scripts.

## JavaScript (TypeScript is not currently used)

- **When to use:** Logic, data transformation, service, and UI changes in the `.js`/`.jsx` codebase.
- **Recommended approach:** Follow neighboring source style and use clear names and explicit control flow.
- **Coding standards:** Keep modules consistent with the existing exports/imports; satisfy the configured ESLint rules.
- **Common mistakes:** Adding TypeScript-only syntax to JavaScript files, relying on unchecked API response assumptions, or changing package settings unnecessarily.
- **Best practices:** Guard optional data where needed and propagate errors rather than masking failures.

## Component development

- **When to use:** Adding or changing reusable UI or a screen.
- **Recommended approach:** Check `src/components/` and neighboring pages first; place new code according to the existing component/page boundaries.
- **Coding standards:** Use function components and JSX; keep screen-specific styles local where possible.
- **Common mistakes:** Duplicating existing navigation/loaders, mixing unrelated screen behavior, or creating components with hidden global side effects.
- **Best practices:** Keep props and responsibilities clear; preserve loading, empty, and error states.

## React Hooks

- **When to use:** Component state, effects, memoized callbacks, and shared custom behavior.
- **Recommended approach:** Follow the current `useAuth` and context usage patterns; inspect effects and dependencies when changing async work.
- **Coding standards:** Call hooks only at the top level of function components or custom hooks; obey `eslint-plugin-react-hooks`.
- **Common mistakes:** Missing effect dependencies, triggering state updates from stale async results, or using effects for derived render-only data.
- **Best practices:** Prefer event handlers for user actions and clean up subscriptions/timers when introducing them.

## Routing

- **When to use:** Adding or changing a URL or access boundary.
- **Recommended approach:** Treat `src/routes/AppRoutes.jsx` as the route source of truth; review `ProtectedRoute.jsx` and `PublicRoute.jsx` before changing auth behavior.
- **Coding standards:** Use React Router patterns and existing nested route/layout structure.
- **Common mistakes:** Forgetting route guards, changing redirect destinations unintentionally, or confusing client-side guards with server authorization.
- **Best practices:** Check direct navigation, nested paths, and unknown-route behavior.

## State management

- **When to use:** Sharing state among screens or related components.
- **Recommended approach:** Reuse `AuthContext`, `CourseContext`, or `LmsAdminContext` when their existing scope fits; otherwise prefer local component state.
- **Coding standards:** Keep context values and updates consistent with current consumers.
- **Common mistakes:** Duplicating server data across unrelated contexts or expanding global state for one component.
- **Best practices:** Trace provider placement in `src/main.jsx` and route-scoped provider use before edits.

## API integration with Axios

- **When to use:** Calling the existing backend API through service modules.
- **Recommended approach:** Use `src/api/axiosInstance.js` and the relevant `src/services/` module; inspect callers and response handling first.
- **Coding standards:** Preserve the `/api/v1` base URL, configured timeout, and established request/response shapes unless requirements authorize a change.
- **Common mistakes:** Hard-coding another API URL, duplicating a service call in a component, or assuming a service endpoint proves backend availability.
- **Best practices:** Propagate request errors to the UI handling layer and avoid logging credentials or sensitive payloads. Note that `src/pages/home/Home.jsx` currently also uses direct `fetch`.

## Authentication and authorization

- **When to use:** Sign-in, sign-out, account, profile, and protected-route work.
- **Recommended approach:** Inspect `src/context/AuthContext.jsx`, `src/hooks/useAuth.js`, `src/services/authServices.js`, the API interceptor, and both route guards.
- **Coding standards:** Never expose or log token values; preserve existing local-storage keys and redirects unless explicitly changed.
- **Common mistakes:** Treating local storage or a client-side role check as sufficient authorization, or clearing a session on every 401 without considering current behavior.
- **Best practices:** Require backend authorization for protected operations and confirm behavior with the backend owner.

## Form handling and validation

- **When to use:** Registration, activation, login, profile, course, and admin form changes.
- **Recommended approach:** Follow the specific form's existing control, submission, and feedback behavior.
- **Coding standards:** Preserve field names and payload shape expected by the service; keep validation feedback actionable.
- **Common mistakes:** Assuming a shared form library exists, submitting duplicate requests, or losing entered values on a failed request.
- **Best practices:** Represent submitting/success/error states clearly and do not claim client validation replaces backend validation.

## Error handling

- **When to use:** Any API or asynchronous UI flow.
- **Recommended approach:** Inspect the existing service and caller to find where errors are surfaced; preserve useful error context.
- **Coding standards:** Reject/throw failures where appropriate and provide user-facing feedback at the UI boundary.
- **Common mistakes:** Empty catches, success-shaped fallback data, or swallowing failures as if a request succeeded.
- **Best practices:** Handle expected states explicitly and avoid exposing internal details or secrets.

## CSS and responsive design

- **When to use:** Any presentation or responsive behavior change.
- **Recommended approach:** Check the page's existing CSS and shared styles before introducing selectors.
- **Coding standards:** Follow current plain CSS/CSS Module usage; use existing naming and avoid unrelated global style changes.
- **Common mistakes:** Broad selectors that leak across pages, conflicting duplicate rules, and fixed sizing that breaks narrow screens.
- **Best practices:** Check relevant viewport sizes and preserve semantic markup and visible focus behavior.

## Debugging

- **When to use:** Reproducing or diagnosing an observed defect.
- **Recommended approach:** Trace the route → component → context/service → Axios/interceptor path and verify the actual input and response.
- **Coding standards:** Keep diagnostic changes temporary and never log secrets or personal data.
- **Common mistakes:** Guessing at backend behavior from client code or changing unrelated files before reproducing the issue.
- **Best practices:** Record a minimal reproduction, distinguish client and server failures, and remove temporary diagnostics.

## Testing

- **When to use:** Validating changes or establishing test coverage.
- **Recommended approach:** No test runner or test files were found; use the existing `npm run lint` and `npm run build` checks, and seek approval before selecting new testing dependencies.
- **Coding standards:** Do not report unrun checks as passed and do not present lint/build as behavioral tests.
- **Common mistakes:** Claiming coverage based on a successful build or manually changing production settings to make tests pass.
- **Best practices:** If a test framework is adopted, add focused tests for the changed route, UI behavior, request, and permission outcomes.

## Git and version control

- **When to use:** Before and after any repository change.
- **Recommended approach:** Inspect `git status` and diffs first; stage only files related to the task.
- **Coding standards:** Preserve unrelated user changes and avoid destructive history/worktree operations.
- **Common mistakes:** Overwriting existing files, including secrets, or mixing unrelated edits.
- **Best practices:** Review the final diff and confirm only intended files changed.

## General recommendations (not project-specific implementation claims)

- Confirm product and API requirements when source code does not establish intended behavior.
- Prefer minimal, reversible changes; request approval before adding dependencies or changing architecture.
- Keep documentation aligned with verified code and clearly label proposals or unverified behavior.
