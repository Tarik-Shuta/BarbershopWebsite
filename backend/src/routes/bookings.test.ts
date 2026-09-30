import assert from "node:assert/strict";
import { test } from "node:test";
import { createBookingSchema } from "./bookings.js";

const validBooking = {
  name: "Sam Barber",
  phone: "+387 60 123 456",
  barber: "Harun",
  service: "Haircut",
  startsAt: "2099-01-01T12:00:00Z",
};

test("accepts a valid booking without optional notes", () => {
  assert.equal(createBookingSchema.safeParse(validBooking).success, true);
});

test("rejects incomplete booking details", () => {
  const result = createBookingSchema.safeParse({ ...validBooking, name: " " });

  assert.equal(result.success, false);
});

test("rejects malformed appointment times and oversized notes", () => {
  assert.equal(createBookingSchema.safeParse({ ...validBooking, startsAt: "tomorrow" }).success, false);
  assert.equal(createBookingSchema.safeParse({ ...validBooking, notes: "x".repeat(1001) }).success, false);
});
