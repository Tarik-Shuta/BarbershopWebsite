import "dotenv/config";
import cors from "cors";
import express from "express";
import { authRouter } from "./routes/auth.js";
import { bookingsRouter } from "./routes/bookings.js";

const app = express();
const frontendUrls = (process.env.FRONTEND_URL ?? "http://localhost:5173,https://urban-barbershop.onrender.com")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

app.use(cors({ origin: frontendUrls }));
app.use(express.json({ limit: "10kb" }));

app.get("/health", (_request, response) => {
  response.json({ status: "ok", message: "Urban Barbershop API is running" });
});

app.use("/api/auth", authRouter);
app.use("/api/bookings", bookingsRouter);

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  const errorType = typeof error === "object" && error !== null && "type" in error ? error.type : undefined;

  if (errorType === "entity.parse.failed") {
    response.status(400).json({ error: "Invalid JSON request body" });
    return;
  }

  if (errorType === "entity.too.large") {
    response.status(413).json({ error: "Request body too large" });
    return;
  }

  console.error("API request failed:", error);
  response.status(500).json({ error: "Internal server error" });
});

export { app };
