import assert from "node:assert/strict";
import { once } from "node:events";
import { test } from "node:test";
import { app } from "./app.js";

async function postJson(body: string): Promise<Response> {
  const server = app.listen(0);
  try {
    await once(server, "listening");

    const address = server.address();
    assert.ok(address && typeof address !== "string");
    return await fetch(`http://localhost:${address.port}/api/bookings`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    });
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  }
}

test("returns a client error for malformed JSON request bodies", async () => {
  const response = await postJson("{invalid");
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: "Invalid JSON request body" });
});

test("returns a payload-too-large response for oversized request bodies", async () => {
  const response = await postJson(JSON.stringify({ notes: "x".repeat(11_000) }));
  assert.equal(response.status, 413);
  assert.deepEqual(await response.json(), { error: "Request body too large" });
});