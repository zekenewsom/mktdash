import { Request, Response, NextFunction } from 'express';
import { sendError } from './apiResponse';

type Bucket = { count: number; windowStart: number };

type LimitPolicy = {
  windowMs: number;
  max: number;
};

const buckets = new Map<string, Bucket>();
const DEFAULT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
const DEFAULT_MAX = Number(process.env.RATE_LIMIT_MAX || 120);

const pathPolicies: Record<string, LimitPolicy> = {
  '/api/history': {
    windowMs: DEFAULT_WINDOW_MS,
    max: Number(process.env.RATE_LIMIT_HISTORY_MAX || 80),
  },
  '/api/health/metrics': {
    windowMs: DEFAULT_WINDOW_MS,
    max: Number(process.env.RATE_LIMIT_HEALTH_MAX || 30),
  },
  '/api/health/data-quality': {
    windowMs: DEFAULT_WINDOW_MS,
    max: Number(process.env.RATE_LIMIT_HEALTH_MAX || 30),
  },
};

function keyFor(req: Request) {
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'unknown';
  return `${ip}:${req.path}`;
}

function policyFor(req: Request): LimitPolicy {
  for (const [prefix, policy] of Object.entries(pathPolicies)) {
    if (req.path.startsWith(prefix)) return policy;
  }
  return { windowMs: DEFAULT_WINDOW_MS, max: DEFAULT_MAX };
}

export function rateLimit(req: Request, res: Response, next: NextFunction) {
  if (req.method === 'OPTIONS') return next();

  const now = Date.now();
  const key = keyFor(req);
  const { windowMs, max } = policyFor(req);
  const current = buckets.get(key);

  if (!current || now - current.windowStart > windowMs) {
    buckets.set(key, { count: 1, windowStart: now });
    return next();
  }

  current.count += 1;
  buckets.set(key, current);

  if (current.count > max) {
    return sendError(
      res,
      'RATE_LIMITED',
      `Too many requests. Limit ${max}/${Math.round(windowMs / 1000)}s`,
      429,
    );
  }

  return next();
}
