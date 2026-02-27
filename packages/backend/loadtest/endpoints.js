#!/usr/bin/env node
const { performance } = require('perf_hooks');

const BASE = process.env.LOADTEST_BASE_URL || 'http://localhost:3001';
const CONCURRENCY = Number(process.env.LOADTEST_CONCURRENCY || 5);
const ROUNDS = Number(process.env.LOADTEST_ROUNDS || 10);

const endpoints = [
  '/api/intelligence/overview',
  '/api/health/data-quality',
  '/api/calendar/events',
  '/api/history?series=SP500',
  '/api/market-indices',
];

function percentile(values, p) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return Number(sorted[idx].toFixed(2));
}

async function hit(path) {
  const start = performance.now();
  const res = await fetch(`${BASE}${path}`);
  await res.text();
  const ms = performance.now() - start;
  return { path, status: res.status, ms };
}

(async () => {
  const byPath = Object.fromEntries(endpoints.map((p) => [p, []]));

  for (let r = 0; r < ROUNDS; r++) {
    const jobs = [];
    for (const path of endpoints) {
      for (let c = 0; c < CONCURRENCY; c++) jobs.push(hit(path));
    }
    const results = await Promise.all(jobs);
    for (const row of results) byPath[row.path].push(row);
  }

  const report = Object.fromEntries(
    Object.entries(byPath).map(([path, rows]) => {
      const d = rows.map((x) => x.ms);
      const non200 = rows.filter((x) => x.status >= 400).length;
      return [path, {
        count: rows.length,
        p50_ms: percentile(d, 50),
        p95_ms: percentile(d, 95),
        max_ms: Number(Math.max(...d).toFixed(2)),
        error_count: non200,
      }];
    }),
  );

  console.log(JSON.stringify({ base: BASE, rounds: ROUNDS, concurrency: CONCURRENCY, report }, null, 2));
})();
