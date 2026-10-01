# Urban Barbershop API

The API uses Node.js 24, Express 5, TypeScript, PostgreSQL, Prisma, and Zod.

## Setup

1. Keep the existing `backend/.env` file and confirm that `DATABASE_URL` is a valid PostgreSQL connection string. `FRONTEND_URL` must include `http://localhost:5173` for local development and the exact deployed frontend origin for production; separate multiple origins with commas.
2. From this directory, install dependencies with `npm install`.
3. Generate the Prisma client and apply committed migrations with `npm run db:generate` and `npm run db:deploy`.
4. Start the development server with `npm run dev`. From `frontend`, run `npm run dev` in a second terminal. The frontend's `frontend/.env.local` should set `VITE_API_URL` to `http://localhost:3000` for local work.

The health check is `GET /health`. It reports whether both the API and its database are reachable. Create a booking with `POST /api/bookings` using JSON fields `barber`, `service`, and an ISO 8601 future `startsAt`; `notes` is optional. The customer name and phone come from the signed-in account. Invalid payloads receive a `400` response.

For production, build with `npm run build`, apply committed migrations with `npm run db:deploy`, then run `npm start`.

For hosting, add `DATABASE_URL`, `AUTH_SECRET`, and `FRONTEND_URL` in the backend service's environment settings. Set `FRONTEND_URL` to every deployed frontend origin (scheme and hostname, without a path), separated by commas. Set the frontend build's `VITE_API_URL` to the backend's public origin (for example `https://your-backend.onrender.com`, without `/api`) and `VITE_MAPBOX_ACCESS_TOKEN` to a public Mapbox token. Vite embeds `VITE_*` values at build time, so set them before building or redeploying the frontend. The Mapbox token must allow the deployed frontend URL in its URL restrictions. After deploy, check `https://<backend-host>/health`; `database: "connected"` means the API and database are ready.
