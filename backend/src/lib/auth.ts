import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import type { NextFunction, Request, Response } from "express";
import { prisma } from "./prisma.js";

const scrypt = promisify(scryptCallback);
const tokenSecret = process.env.AUTH_SECRET ?? (process.env.NODE_ENV === "production" ? "" : "development-only-secret-change-me");
if (!tokenSecret) throw new Error("AUTH_SECRET must be set in production");

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "CUSTOMER" | "BARBER";
  barberName: string | null;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

function sign(value: string) {
  return createHmac("sha256", tokenSecret).update(value).digest("base64url");
}

function hasValidSignature(payload: string, signature: string) {
  const supplied = Buffer.from(signature, "base64url");
  const expected = Buffer.from(sign(payload), "base64url");
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("base64url");
  const hash = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${hash.toString("base64url")}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [salt, stored] = storedHash.split(":");
  if (!salt || !stored) return false;

  const actual = (await scrypt(password, salt, 64)) as Buffer;
  const expected = Buffer.from(stored, "base64url");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function createToken(user: AuthenticatedUser) {
  const payload = Buffer.from(JSON.stringify({ id: user.id, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export async function requireAuth(request: Request, response: Response, next: NextFunction) {
  const token = request.header("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) {
    response.status(401).json({ error: "Authentication is required" });
    return;
  }

  const [payload, signature] = token.split(".");
  if (!payload || !signature || !hasValidSignature(payload, signature)) {
    response.status(401).json({ error: "Invalid authentication token" });
    return;
  }

  let decoded: { id?: string; exp?: number };
  try {
    decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { id?: string; exp?: number };
  } catch {
    response.status(401).json({ error: "Invalid or expired authentication token" });
    return;
  }

  if (!decoded.id || !decoded.exp || decoded.exp < Date.now()) {
    response.status(401).json({ error: "Invalid or expired authentication token" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { id: true, name: true, email: true, phone: true, role: true, barberName: true },
  });
  if (!user) {
    response.status(401).json({ error: "Invalid or expired authentication token" });
    return;
  }

  request.user = user;
  next();
}

export function requireBarber(request: Request, response: Response, next: NextFunction) {
  if (request.user?.role !== "BARBER" || !request.user.barberName) {
    response.status(403).json({ error: "Barber access is required" });
    return;
  }
  next();
}
