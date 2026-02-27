import { Request, Response, NextFunction } from 'express';

type Entry = { path: string; durationMs: number; status: number; ts: number };

const MAX_ENTRIES = 1000;
const entries: Entry[] = [];

function percentile(values: number[], p: number) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return Number(sorted[idx].toFixed(2));
}

export function trackRequestMetrics(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;
    entries.push({ path: req.path, durationMs, status: res.statusCode, ts: Date.now() });
    if (entries.length > MAX_ENTRIES) entries.splice(0, entries.length - MAX_ENTRIES);
  });
  next();
}

export function getRequestMetricsSnapshot() {
  const windowMs = 15 * 60 * 1000;
  const now = Date.now();
  const recent = entries.filter((e) => now - e.ts <= windowMs);
  const durations = recent.map((e) => e.durationMs);

  const byPath = Object.fromEntries(
    Object.entries(
      recent.reduce<Record<string, number[]>>((acc, e) => {
        acc[e.path] = acc[e.path] || [];
        acc[e.path].push(e.durationMs);
        return acc;
      }, {}),
    ).map(([path, vals]) => [
      path,
      {
        count: vals.length,
        p50_ms: percentile(vals, 50),
        p95_ms: percentile(vals, 95),
        max_ms: Number(Math.max(...vals).toFixed(2)),
      },
    ]),
  );

  return {
    window_minutes: 15,
    sample_count: recent.length,
    p50_ms: percentile(durations, 50),
    p95_ms: percentile(durations, 95),
    max_ms: durations.length ? Number(Math.max(...durations).toFixed(2)) : 0,
    by_path: byPath,
  };
}
