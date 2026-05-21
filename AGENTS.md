# AGENTS.md

This file is a quick orientation guide for coding agents working in the Kedada
frontend repo. Use it together with `README.md`; the README explains how to run
the app, while this file focuses on how to navigate and change the code safely.

## Repository Snapshot

Kedada Frontend is a React web app for discovering events in El Salvador. It
consumes the Spring Boot API in the sibling backend repo.

- Runtime: Node.js 20 or newer is recommended.
- Framework/tooling: React 19, TypeScript, Vite 6.
- Routing: React Router.
- Data fetching/cache: TanStack Query.
- HTTP client: Axios, centralized in `src/api`.
- Styling: Tailwind CSS 4 through `@tailwindcss/vite`.
- Icons: `lucide-react`.
- Static runtime image: nginx.
- Backend repo: `/home/alex/Documents/kedada-api`.
- Compose repo: `/home/alex/Documents/kedada-compose`.

## How To Run

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Build and verify:

```bash
npm run build
npm run lint
```

Preview the production build:

```bash
npm run preview
```

Useful local URLs:

- Frontend dev server: `http://localhost:5173`
- Backend API: `http://localhost:8080`
- Backend Swagger UI: `http://localhost:8080/swagger-ui.html`

## Configuration

The frontend reads the API base URL from:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

In the combined Docker Compose setup, `VITE_API_BASE_URL` is intentionally set
to an empty string so browser requests use same-origin `/api/v1/...` paths. The
frontend nginx config in `/home/alex/Documents/kedada-compose/frontend-nginx.conf`
proxies `/api/` to the API service.

Because Vite embeds environment variables at build time, changing
`VITE_API_BASE_URL` requires rebuilding the frontend.

## Project Structure

```text
src/
  api/
    client.ts      Axios instance and shared API error helper.
    events.ts      API calls for events, categories, URLs, schedules, metrics.
    types.ts       TypeScript DTOs matching backend responses.
  components/
    events/        Event cards, grids, search, filters.
    layout/        Header, footer, page shell.
    ui/            Reusable UI primitives and states.
  hooks/           TanStack Query hooks and data enrichment.
  pages/           Route-level screens.
  utils/           Formatting and small pure helpers.
  App.tsx          Router setup.
  main.tsx         React root and QueryClient provider.
  styles.css       Tailwind import and global styles.
```

## Backend Contract Rules

Before changing API contracts, read the backend source of truth:

```text
/home/alex/Documents/kedada-api/AGENTS.md
/home/alex/Documents/kedada-api/src/main/java/com/kedada/backend
```

Do not invent endpoints, response fields, or filters. Confirm them in backend
controllers, DTOs, repositories, and Swagger/OpenAPI if the backend is running.

Current frontend-used endpoints:

- `GET /api/v1/events`
- `GET /api/v1/events/{id}`
- `GET /api/v1/categories`
- `GET /api/v1/categories/{id}`
- `GET /api/v1/urls/{id}`
- `GET /api/v1/events/{eventId}/metrics/summary`

Current event search params supported by the backend:

- `q`
- `categoryId`
- `minPrice`
- `maxPrice`
- `priority`
- `fromDate`
- `toDate`
- `page`
- `size`
- `sort`

Supported event sort fields are controlled by the backend: `createdAt`,
`updatedAt`, `title`, `priority`, and `price`.

## API Data Notes

- `EventResponse` returns related IDs (`categoryId`, `siteUrlId`,
  `referenceUrlId`) instead of embedded objects.
- The frontend enriches events with separate category and URL calls.
- Enrichment failures for optional related data should not crash the UI.
- `thumbnail` is currently only a UUID. There is no backend image/file endpoint.
- The API has a global schedule list, but no per-event schedule endpoint yet.
- The backend may not have CORS configured; the Docker Compose nginx proxy avoids
  this by keeping frontend API calls same-origin.

## UI And UX Guidelines

The UI is Spanish-first and aimed at users discovering events in El Salvador.

Keep the interface:

- Clean, practical, and responsive.
- Fast to scan on mobile and desktop.
- Warm enough for an events/news discovery product without becoming decorative.
- Graceful when optional backend fields are missing.

For every API call, preserve:

- Loading state.
- Error state with a useful message via `getApiErrorMessage`.
- Empty state for empty lists.
- Safe handling for `null` or missing optional fields.

External links must use:

```tsx
target="_blank"
rel="noopener noreferrer"
```

Use `lucide-react` icons for buttons and small UI signals when an appropriate
icon exists.

## Development Patterns

- Keep API access centralized in `src/api`.
- Keep backend DTO shapes in `src/api/types.ts`.
- Prefer TanStack Query hooks in `src/hooks` for server state.
- Keep pages focused on route composition and state wiring.
- Extract repeated event UI into `src/components/events`.
- Do not add fake/mock API data unless the user explicitly asks for it.
- Avoid broad refactors unrelated to the task.
- If a backend gap blocks a UI feature, degrade gracefully and document the gap.

## Docker

The frontend Dockerfile builds with Node 20 and serves `dist` through nginx.

Build:

```bash
docker build \
  --build-arg VITE_API_BASE_URL=http://localhost:8080 \
  -t kedada-frontend:local .
```

Run:

```bash
docker run --rm -p 5173:80 kedada-frontend:local
```

Combined full-stack Compose lives in:

```text
/home/alex/Documents/kedada-compose
```

Run the full stack from that folder:

```bash
docker compose up --build
```

## Verification Expectations

For code changes, run:

```bash
npm run build
npm run lint
```

If you change Docker-related files, also run:

```bash
docker build -t kedada-frontend:local .
```

If you cannot run verification, say exactly why and what remains unverified.
