# mktdash Recalibration — 2026-02-27

## Goal Alignment Check
Primary goal remains unchanged:
- Deliver a robust, decision-grade market intelligence platform with trustworthy live data, clear confidence/freshness signals, and reliable operations.

## Current State (What is solid)
1. Staging topology is live and connected:
   - Backend on Render
   - Frontend on Vercel
2. Frontend->backend wiring is environment-configurable (`VITE_API_BASE_URL`).
3. Core intelligence surfaces are implemented:
   - Regime state
   - What changed
   - Cross-asset confirmation matrix
   - Data quality console
   - Economic calendar
4. Runtime payload validation now exists for key API surfaces.
5. Secret hygiene baseline is in place (scan script + pre-commit hook).

## Gaps vs Robustness Goal
1. Ingestion hardening is incomplete:
   - freshness/completeness/drift metrics need deeper coverage
   - replay/backfill capability still pending
2. API observability/perf controls incomplete:
   - request timing/p95 and provider-level cache/retry not fully implemented
3. Frontend resilience not complete:
   - standardized empty/offline/error states need full pass
4. Report-engine scope not locked yet.

## Recalibrated Priority (next 72h)
1. Finish ingestion quality metrics (`T1-004`)
2. Build replay/backfill job + runbook + deterministic validation (`T1-007..009`)
3. Add API timing/p95 + provider cache/retry (`T2-004..005`)
4. Finish frontend resilience pass (`T3-001`)

## Success Criteria for this Recalibration Window
- Data quality telemetry includes freshness + completeness + drift for all served intelligence datasets
- Replay job can reprocess 7 days idempotently with deterministic output counts
- API timing metrics and provider retry/caching are active in staging
- Every intelligence widget has explicit loading/empty/error/offline handling

## Risks
- FRED-only concentration for some metrics remains a medium risk
- Render free tier cold starts can distort response timing during testing

## Decision Needed Next
- Report-engine v1 scope lock before Phase 4 execution (sections, cadence, output format)
