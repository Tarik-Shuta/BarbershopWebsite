# Urban Barbershop API

The API uses Node.js 24, Express 5, TypeScript, PostgreSQL, Prisma, and Zod.

## Setup

1. Set `DATABASE_URL` in the existing `.env` to your PostgreSQL connection string, using `.env.example` as a reference; keep the existing `PORT` and `FRONTEND_URL` values.
2. From this directory, install dependencies with `npm install`.
3. Generate the Prisma client and create the local database migration with `npm run db:generate` and `npm run db:migrate`.
4. Start the development server with `npm run dev`.

The health check is `GET /health`. Create a booking with `POST /api/bookings` using JSON fields `name`, `phone`, `barber`, `service`, and an ISO 8601 future `startsAt`; `notes` is optional. Invalid payloads receive a `400` response.

For production, build with `npm run build`, apply committed migrations with `npm run db:deploy`, then run `npm start`.

For hosting, set the backend's `FRONTEND_URL` to every deployed frontend origin (scheme and hostname, without a path), separated by commas. The default includes the project's Render frontend, `https://urban-barbershop.onrender.com`, and local Vite development. Set the frontend build's `VITE_API_URL` to the backend's public origin (for example `https://your-backend.onrender.com`, without `/api`). Also set `VITE_MAPBOX_ACCESS_TOKEN` to a public Mapbox token. Vite embeds `VITE_*` values at build time, so set them before building or redeploying the frontend. The Mapbox token must allow the deployed frontend URL in its URL restrictions.
