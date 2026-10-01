import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireBarber } from "../lib/auth.js";

export const createBookingSchema = z.object({
  barber: z.string().trim().min(1).max(100),
  service: z.string().trim().min(1).max(100),
  startsAt: z.iso.datetime({ offset: true }),
  notes: z.string().trim().max(1000).optional(),
});

export const bookingsRouter = Router();

const decisionSchema = z.object({ status: z.enum(["CONFIRMED", "DECLINED"]) });

bookingsRouter.get("/availability", async (request, response) => {
  const parsed = z.object({ barber: z.string().min(1), from: z.iso.datetime({ offset: true }), to: z.iso.datetime({ offset: true }) }).safeParse(request.query);
  if (!parsed.success) { response.status(400).json({ error: "Choose a barber and date" }); return; }
  const dayStart = new Date(parsed.data.from);
  const dayEnd = new Date(parsed.data.to);
  const bookings = await prisma.booking.findMany({
    where: { barber: parsed.data.barber, startsAt: { gte: dayStart, lt: dayEnd }, status: { in: ["PENDING", "CONFIRMED"] } },
    select: { startsAt: true },
  });
  response.json({ booked: bookings.map(({ startsAt }) => startsAt.toISOString()) });
});

bookingsRouter.post("/", requireAuth, async (request, response) => {
  const parsed = createBookingSchema.safeParse(request.body);

  if (!parsed.success) {
    response.status(400).json({ error: "Invalid booking details", details: parsed.error.issues });
    return;
  }

  const startsAt = new Date(parsed.data.startsAt);
  const hours = Number(parsed.data.startsAt.slice(11, 13));
  const minutes = Number(parsed.data.startsAt.slice(14, 16));
  if (startsAt <= new Date() || hours < 10 || hours >= 20 || minutes % 30 !== 0) {
    response.status(400).json({ error: "Choose a future 30-minute slot between 10:00 and 20:00" });
    return;
  }

  const conflict = await prisma.booking.findFirst({ where: { barber: parsed.data.barber, startsAt, status: { in: ["PENDING", "CONFIRMED"] } } });
  if (conflict) { response.status(409).json({ error: "That slot has just been booked. Please choose another." }); return; }

  const account = request.user!;

  const booking = await prisma.booking.create({
    data: {
      name: account.name,
      phone: account.phone,
      barber: parsed.data.barber,
      service: parsed.data.service,
      startsAt,
      notes: parsed.data.notes ?? null,
      userId: account.id,
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

bookingsRouter.get("/mine", requireAuth, async (request, response) => {
  const bookings = await prisma.booking.findMany({ where: { userId: request.user!.id }, orderBy: { startsAt: "asc" } });
  response.json({ bookings });
});

bookingsRouter.get("/queue", requireAuth, requireBarber, async (request, response) => {
  const now = new Date();
  const dayEnd = new Date(now); dayEnd.setHours(24, 0, 0, 0);
  const bookings = await prisma.booking.findMany({
    where: {
      barber: request.user!.barberName!,
      OR: [
        { status: "PENDING" },
        { startsAt: { gte: now, lt: dayEnd }, status: "CONFIRMED" },
      ],
    },
    include: { user: { select: { email: true } } }, orderBy: { startsAt: "asc" },
  });
  response.json({ bookings });
});

bookingsRouter.get("/history", requireAuth, requireBarber, async (request, response) => {
  const bookings = await prisma.booking.findMany({
    where: {
      barber: request.user!.barberName!,
      status: "CONFIRMED",
      startsAt: { lt: new Date() },
    },
    orderBy: { startsAt: "desc" },
    take: 50,
  });
  response.json({ bookings });
});

bookingsRouter.get("/schedule", requireAuth, requireBarber, async (request, response) => {
  const parsed = z.object({
    from: z.iso.datetime({ offset: true }),
    to: z.iso.datetime({ offset: true }),
  }).safeParse(request.query);
  if (!parsed.success || new Date(parsed.data.to) <= new Date(parsed.data.from)) {
    response.status(400).json({ error: "Choose a valid day" });
    return;
  }

  const bookings = await prisma.booking.findMany({
    where: {
      barber: request.user!.barberName!,
      status: "CONFIRMED",
      startsAt: { gte: new Date(Math.max(new Date(parsed.data.from).getTime(), Date.now())), lt: new Date(parsed.data.to) },
    },
    orderBy: { startsAt: "asc" },
  });
  response.json({ bookings });
});

bookingsRouter.patch("/:id/decision", requireAuth, requireBarber, async (request, response) => {
  const parsed = decisionSchema.safeParse(request.body);
  if (!parsed.success) { response.status(400).json({ error: "Choose accept or decline" }); return; }
  const bookingId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
  if (!bookingId) { response.status(404).json({ error: "Booking not found" }); return; }
  const booking = await prisma.booking.findFirst({ where: { id: bookingId, barber: request.user!.barberName! } });
  if (!booking) { response.status(404).json({ error: "Booking not found" }); return; }
  if (booking.status !== "PENDING") { response.status(409).json({ error: "This booking has already been decided" }); return; }
  const updated = await prisma.booking.update({ where: { id: booking.id }, data: { status: parsed.data.status } });
  response.json({ booking: updated });
});
