import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

export const createBookingSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(6).max(30),
  barber: z.string().trim().min(1).max(100),
  service: z.string().trim().min(1).max(100),
  startsAt: z.iso.datetime({ offset: true }),
  notes: z.string().trim().max(1000).optional(),
});

export const bookingsRouter = Router();

bookingsRouter.post("/", async (request, response) => {
  const parsed = createBookingSchema.safeParse(request.body);

  if (!parsed.success) {
    response.status(400).json({ error: "Invalid booking details", details: parsed.error.issues });
    return;
  }

  if (new Date(parsed.data.startsAt) <= new Date()) {
    response.status(400).json({ error: "Booking time must be in the future" });
    return;
  }

  const booking = await prisma.booking.create({
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone,
      barber: parsed.data.barber,
      service: parsed.data.service,
      startsAt: new Date(parsed.data.startsAt),
      notes: parsed.data.notes ?? null,
    },
    select: {
      id: true,
      name: true,
      barber: true,
      service: true,
      startsAt: true,
      status: true,
      createdAt: true,
    },
  });

  response.status(201).json({ booking });
});