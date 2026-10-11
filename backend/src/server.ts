import "dotenv/config";

console.log("Starting Urban Barbershop backend...");

try {
  const { app } = await import("./app.js");

  const port = Number(process.env.PORT ?? 3000);

  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  server.on("error", (error) => {
    console.error("Failed to start HTTP server:", error);
  });
} catch (error) {
  console.error("Backend failed during startup:");
  console.error(error);

  process.exit(1);
}