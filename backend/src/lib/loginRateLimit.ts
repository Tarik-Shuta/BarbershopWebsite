import type { NextFunction, Request, Response } from "express";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const MAX_TRACKED_IPS = 10_000;

type AttemptBucket = { attempts: number; expiresAt: number };
const attemptsByIp = new Map<string, AttemptBucket>();

export function limitLoginAttempts(request: Request, response: Response, next: NextFunction) {
  const now = Date.now();
  const ip = request.ip ?? request.socket.remoteAddress ?? "unknown";
  let bucket = attemptsByIp.get(ip);

  if (!bucket || bucket.expiresAt <= now) {
    if (attemptsByIp.size >= MAX_TRACKED_IPS) {
      for (const [trackedIp, trackedBucket] of attemptsByIp) {
        if (trackedBucket.expiresAt <= now) attemptsByIp.delete(trackedIp);
      }
      if (attemptsByIp.size >= MAX_TRACKED_IPS) {
        response.status(503).json({ error: "Login is temporarily unavailable. Try again shortly." });
        return;
      }
    }
    bucket = { attempts: 0, expiresAt: now + WINDOW_MS };
    attemptsByIp.set(ip, bucket);
  }

  if (bucket.attempts >= MAX_ATTEMPTS) {
    response.setHeader("Retry-After", String(Math.ceil((bucket.expiresAt - now) / 1000)));
    response.status(429).json({ error: "Too many login attempts. Try again later." });
    return;
  }

  bucket.attempts += 1;
  response.once("finish", () => {
    if (response.statusCode < 400) attemptsByIp.delete(ip);
  });
  next();
}
