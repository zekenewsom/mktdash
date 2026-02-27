import { Request, Response, NextFunction } from 'express';
import { sendError } from './apiResponse';

type Bucket = { count: number; windowStart: number };

const buckets = new Map<string, Bucket>();
const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
const MAX_REQ_PER_WINDOW = Number(process.env.RATE_LIMIT_MAX || 120);

function keyFor(req: Request) {
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'unknown';
  return `${ip}:${req.path}`;
}

export function rateLimit(req: Request, res: Response, next: NextFunction) {
  const now = Date.now();
  const key = keyFor(req);
  const current = buckets.get(key);

  if (!current || now - current.windowStart > WINDOW_MS) {
    buckets.set(key, { count: 1, windowStart: now });
    return next();
  }

  current.count += 1;
  buckets.set(key, current);

  if (current.count > MAX_REQ_PER_WINDOW) {
    return sendError(
      res,
      'RATE_LIMITED',
      `Too many requests. Limit ${MAX_REQ_PER_WINDOW}/${Math.round(WINDOW_MS / 1000)}s`,
      429,
    );
  }

  return next();
}
