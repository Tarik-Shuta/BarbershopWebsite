import { Router } from "express";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { createToken, hashPassword, requireAuth, verifyPassword, type AuthenticatedUser } from "../lib/auth.js";
import { prisma } from "../lib/prisma.js";

const credentialsSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8).max(128),
});

const registerSchema = credentialsSchema.extend({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(6).max(30),
});

const publicUserFields = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  barberName: true,
} satisfies Prisma.UserSelect;

function userResponse(user: AuthenticatedUser) {
  return { user, token: createToken(user) };
}

export const authRouter = Router();

authRouter.post("/register", async (request, response) => {
  const parsed = registerSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: "Invalid registration details", details: parsed.error.issues });
    return;
  }

  let user;
  try {
    user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        passwordHash: await hashPassword(parsed.data.password),
      },
      select: publicUserFields,
    });
  } catch (error) {
    if (isDuplicateEmail(error)) {
      response.status(409).json({ error: "An account with this email already exists" });
      return;
    }
    throw error;
  }
  response.status(201).json(userResponse(user));
});

authRouter.post("/login", async (request, response) => {
  const parsed = credentialsSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: "Invalid email or password" });
    return;
  }

  const account = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { ...publicUserFields, passwordHash: true },
  });
  if (!account || !(await verifyPassword(parsed.data.password, account.passwordHash))) {
    response.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const { passwordHash: _passwordHash, ...user } = account;
  response.json(userResponse(user));
});

function isDuplicateEmail(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

authRouter.get("/me", requireAuth, (request, response) => {
  response.json({ user: request.user });
});
