import "dotenv/config";
import cors from "cors";
import express from "express";
import { bookingsRouter } from "./routes/bookings.js";

const app = express();
const port = Number(process.env.PORT ?? 3000);
const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:5173";

app.use(cors({ origin: frontendUrl }));
app.use(express.json({ limit: "10kb" }));

app.get("/health", (_request, response) => {
  response.json({ status: "ok", message: "Urban Barbershop API is running" });
});

app.use("/api/bookings", bookingsRouter);

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  console.error("API request failed:", error);
  response.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});