# Kedada Frontend

Web frontend for discovering events published by the Kedada API.

## Requirements

- Node.js 20 or newer.
- Kedada backend running at `http://localhost:8080`.

## Configuration

Create a `.env` file if you need to change the backend URL:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

## Routes

- `/`: home page with search, featured events, and recent events.
- `/eventos`: paginated event list with search and category filtering.
- `/eventos/:id`: event detail page.

## Used Endpoints

- `GET /api/v1/events`
- `GET /api/v1/events/{id}`
- `GET /api/v1/categories`
- `GET /api/v1/categories/{id}`
- `GET /api/v1/urls?eventId={eventId}`
- `GET /api/v1/schedules?eventId={eventId}`
- `GET /api/v1/events/{eventId}/metrics/summary`

## API Assumptions And Gaps

- `EventResponse` returns `categoryIds` with at least one category; URLs and schedules are collections
  queried by `eventId`. The frontend tolerates failures for optional data.
- `thumbnail` is a UUID, but the API does not expose a file/image endpoint. The
  UI shows a stable visual block and the UUID when one exists.
- No CORS configuration was found in the backend. If the browser blocks requests
  from Vite, the backend must allow the frontend origin, for example
  `http://localhost:5173`.

## Docker

Build the image:

```bash
docker build \
  --build-arg VITE_API_BASE_URL=http://localhost:8080 \
  -t kedada-frontend:local .
```

Run the container:

```bash
docker run --rm -p 5173:80 kedada-frontend:local
```

The app will be available at `http://localhost:5173`.
