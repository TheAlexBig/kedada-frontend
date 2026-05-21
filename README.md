# Kedada Frontend

Frontend web para descubrir eventos publicados por la API de Kedada.

## Requisitos

- Node.js 20 o superior.
- Backend Kedada corriendo en `http://localhost:8080`.

## Configuracion

Crea un archivo `.env` si necesitas cambiar la URL del backend:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

## Comandos

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

## Rutas

- `/`: inicio con busqueda, eventos destacados y eventos recientes.
- `/eventos`: listado paginado con busqueda y filtro por categoria.
- `/eventos/:id`: detalle de evento.

## Endpoints usados

- `GET /api/v1/events`
- `GET /api/v1/events/{id}`
- `GET /api/v1/categories`
- `GET /api/v1/categories/{id}`
- `GET /api/v1/urls/{id}`
- `GET /api/v1/events/{eventId}/metrics/summary`

## Supuestos y gaps de API

- `EventResponse` devuelve `categoryId`, `siteUrlId` y `referenceUrlId`, no objetos
  embebidos. El frontend resuelve esos datos con llamadas separadas y tolera errores
  en campos opcionales.
- `thumbnail` es un UUID, pero la API no expone un endpoint de archivos/imagenes. La
  UI muestra un bloque visual estable y el UUID cuando existe.
- No se encontro configuracion CORS en el backend. Si el navegador bloquea peticiones
  desde Vite, el backend debe permitir el origen del frontend, por ejemplo
  `http://localhost:5173`.
- La API lista horarios globales, pero no expone horarios por evento. Por eso el
  detalle usa fechas de publicacion/actualizacion y no agenda de horarios.

## Docker

Construir la imagen:

```bash
docker build \
  --build-arg VITE_API_BASE_URL=http://localhost:8080 \
  -t kedada-frontend:local .
```

Correr el contenedor:

```bash
docker run --rm -p 5173:80 kedada-frontend:local
```

La app quedara disponible en `http://localhost:5173`.
