import cors from "cors";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

import { authRouter } from "./routes/auth.js";
import { bookingsRouter } from "./routes/bookings.js";
import { prisma } from "./lib/prisma.js";

const app = express();

const frontendUrls = (
    process.env.FRONTEND_URL ??
    "http://localhost:5173,https://urban-barbershop.onrender.com"
)
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);

app.use(
    cors({
      origin(origin, callback) {
        // Allow requests without an Origin header:
        // curl, Postman, server-to-server requests, etc.
        if (!origin) {
          callback(null, true);
          return;
        }

        if (frontendUrls.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`CORS blocked origin: ${origin}`));
      },
      credentials: true,
    })
);

app.use(express.json({ limit: "10kb" }));

// Simple API test that does NOT depend on PostgreSQL.
app.get("/", (_request: Request, response: Response) => {
  response.json({
    status: "ok",
    message: "Urban Barbershop API is running",
  });
});

// Health check including database connection.
app.get("/health", async (_request: Request, response: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    response.json({
      status: "ok",
      database: "connected",
      message: "Urban Barbershop API is running",
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    response.status(503).json({
      status: "error",
      database: "disconnected",
      message: "The API is running but cannot reach its database",
    });
  }
});

app.use("/api/auth", authRouter);
app.use("/api/bookings", bookingsRouter);

// 404 handler
app.use((_request: Request, response: Response) => {
  response.status(404).json({
    error: "Route not found",
  });
});

// Global error handler
app.use(
    (
        error: unknown,
        _request: Request,
        response: Response,
        _next: NextFunction
    ) => {
      const errorType =
          typeof error === "object" &&
          error !== null &&
          "type" in error
              ? (error as { type?: string }).type
              : undefined;

      if (errorType === "entity.parse.failed") {
        response.status(400).json({
          error: "Invalid JSON request body",
        });
        return;
      }

      if (errorType === "entity.too.large") {
        response.status(413).json({
          error: "Request body too large",
        });
        return;
      }

      console.error("API request failed:", error);

      response.status(500).json({
        error: "Internal server error",
      });
    }
);

export { app };