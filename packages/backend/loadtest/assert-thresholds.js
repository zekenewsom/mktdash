#!/usr/bin/env node
const fs = require('fs');

const file = process.argv[2];
if (!file) {
  console.error('Usage: node assert-thresholds.js <loadtest.json>');
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(file, 'utf8'));
const maxP95 = Number(process.env.LOADTEST_MAX_P95_MS || 1500);
const maxErrors = Number(process.env.LOADTEST_MAX_ERRORS || 0);

let failed = false;
for (const [path, stats] of Object.entries(report.report || {})) {
  if (stats.p95_ms > maxP95) {
    console.error(`[gate] FAIL p95 ${path}: ${stats.p95_ms} > ${maxP95}`);
    failed = true;
  }
  if (stats.error_count > maxErrors) {
    console.error(`[gate] FAIL errors ${path}: ${stats.error_count} > ${maxErrors}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log('[gate] PASS thresholds');
