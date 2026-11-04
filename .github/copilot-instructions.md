# Copilot Instructions for Skillora

Skillora is a JavaScript/JSX React 19 + Vite learning platform using React Router, Context API, Axios, and CSS. Read [AGENTS.md](../AGENTS.md) for project-wide change rules; consult [PLAN.md](../PLAN.md), [SKILLS.md](../SKILLS.md), [MEMORY.md](../MEMORY.md), and [MCP.md](../MCP.md) when relevant.

- Inspect the affected route, page, provider, service, and callers before changing behavior. Preserve existing functionality and API shapes.
- Follow nearby component, hook, route, state, and styling patterns. Most API calls use `src/api/axiosInstance.js` and `src/services/`; do not assume all calls do.
- Respect existing public/protected/admin route boundaries. Client-side guards do not replace backend authorization.
- Surface request failures appropriately; do not swallow errors or expose tokens, credentials, or personal data.
- No test runner or test files were found. Use available `npm run lint` and `npm run build` checks where applicable; do not claim they verify runtime behavior.
- Avoid unnecessary dependencies, broad refactors, or unrelated configuration changes. For documentation-only tasks, do not modify application code or dependencies.
