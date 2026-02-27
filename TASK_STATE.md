# mktdash — Dynamic Ops Board

Last updated: 2026-02-26 00:03 EST
Status: ACTIVE
Mode: Rolling Kanban (dynamic reprioritization)

## Owners
- **DAE** = Daedalus (coordination + implementation)
- **PHR** = Phronesis (ops planning/checklists)
- **HUM** = You (approvals, priorities, product decisions)

---

## NOW (in-flight / next 24h)
- [ ] **S0-001** Keep phone preview running + verify external reachability — **Owner: DAE**
- [x] **S0-002** Set backend `.env` for stable data-source behavior — **Owner: DAE**
- [x] **S1-001** Start canonical schema file + API error envelope — **Owner: DAE**
- [ ] **S1-002** Add basic health endpoint for service/data freshness — **Owner: DAE**
- [x] **S1-003** Complete module value audit (info-first scoring + launch layout) — **Owner: PHR**
- [x] **S1-004** Publish coding+commit plan for Sprint 1 (frontend info architecture) — **Owner: PHR**
- [x] **S1-005** Start Session 1 coding: add frontend intelligence contracts — **Owner: DAE**
- [x] **S1-006** Start Session 2 coding: add RegimeStateCard + WhatChangedPanel shells — **Owner: DAE**
- [x] **S1-007** Backend kickoff: define live-data endpoints for regime + material changes — **Owner: DAE/PHR**
- [x] **S1-008** Frontend wiring: replace fixtures with `/api/intelligence/overview` data fetch — **Owner: DAE**
- [x] **S1-009** Backend refinement: add explicit fallback/confidence badges from `quality_flags` in intelligence payload — **Owner: DAE**
- [x] **S2-001** Sprint 2 kickoff: add `stale_used/stale_count` and confidence downgrade rules to intelligence overview — **Owner: DAE**
- [x] **S2-002** Sprint 2: ship Top-row trust UX (source + stale/fallback badges in regime card) — **Owner: DAE**
- [x] **S2-003** Sprint 2: add `/api/health/data-quality` baseline fields for frontend quality console — **Owner: DAE**
- [x] **S2-004** Sprint 2: scaffold economic calendar API + frontend placeholder replacement — **Owner: DAE**
- [x] **S2-005** Sprint 2: wire frontend Data Quality Console shell to `/api/health/data-quality` — **Owner: DAE**
- [ ] **S2-006** Sprint 2: replace calendar scaffold source with live free-source ingestion (API/RSS-first) — **Owner: DAE/SOPHIA**
- [ ] **OPS-001** Merge PHR plan deltas into board as they arrive (no static freeze) — **Owner: DAE/PHR**

## NEXT (queued / this week)
- [ ] **T1-001** Create canonical market data schemas (`symbol`, `source`, `as_of`, `value`, `unit`, `quality_flags`) — **Owner: DAE**
- [ ] **T1-002** Add schema versioning strategy + migration notes (`docs/data-contracts.md`) — **Owner: DAE**
- [ ] **T1-003** Wire validation into ingestion entrypoints — **Owner: DAE**
- [ ] **T1-004** Add freshness/completeness/drift metrics per dataset — **Owner: DAE**
- [ ] **T1-005** Expose `/api/health/data-quality` endpoint — **Owner: DAE**
- [ ] **T1-006** Add frontend quality panel placeholder — **Owner: DAE**

## BLOCKED (waiting on decision/input)
- [ ] **B-001** Confirm preferred phone access path (private Tailnet vs public HTTPS deploy) — **Owner: HUM**
- [ ] **B-002** Select deployment target for staging (Vercel/Render/Fly/self-host) — **Owner: HUM**
- [ ] **B-003** Confirm if we rotate existing API keys found in sample envs before wider rollout — **Owner: HUM/DAE**

## DONE
- [x] **D-001** Initial 10-week robustness plan drafted by PHR
- [x] **D-002** Initial execution board created (`TASK_STATE.md`)
- [x] **D-003** Local preview stack bootstrapped (frontend/backend run confirmed)
- [x] **D-004** Backend env behavior stabilized with provider mode + timeout defaults
- [x] **D-005** Canonical data contract + API error envelope scaffolded

---

## BACKLOG (milestone-indexed)

### Phase 1 — Data Layer Hardening (W1–W2)
- [ ] **T1-007** Implement idempotent replay job (7-day window) — **Owner: DAE**
- [ ] **T1-008** Write runbook (`runbooks/backfill-replay.md`) — **Owner: PHR**
- [ ] **T1-009** Validate deterministic replay counts ±0.1% — **Owner: DAE**

### Phase 2 — Backend/API Quality (W3–W4)
- [ ] **T2-001** Define error envelope and API response shape — **Owner: DAE**
- [ ] **T2-002** Generate OpenAPI spec for all existing routes — **Owner: DAE**
- [ ] **T2-003** Publish docs endpoint/static artifact — **Owner: DAE**
- [ ] **T2-004** Add request timing + p95 metrics — **Owner: DAE**
- [ ] **T2-005** Add caching + timeout/retry policy by provider — **Owner: DAE**
- [ ] **T2-006** Add rate limiting + abuse controls — **Owner: DAE**
- [ ] **T2-007** Add load tests for top 5 endpoints — **Owner: DAE**
- [ ] **T2-008** Add CI gate for latency/error thresholds — **Owner: DAE**

### Phase 3 — Frontend UX Resilience (W3–W4 overlap)
- [ ] **T3-001** Standard loading/empty/error/offline states — **Owner: DAE**
- [ ] **T3-002** Route-level error boundaries — **Owner: DAE**
- [ ] **T3-003** Mobile breakpoints + chart responsiveness pass — **Owner: DAE**
- [ ] **T3-004** A11y quick audit (critical WCAG checks) — **Owner: DAE**

### Phase 4 — Report Engine Pipeline (W5–W6)
- [ ] **T4-001** Define report template schema + input contract — **Owner: PHR/DAE**
- [ ] **T4-002** Implement deterministic generation pipeline — **Owner: DAE**
- [ ] **T4-003** Add queue/retry/dead-letter flow — **Owner: DAE**
- [ ] **T4-004** Add provenance metadata (`run_id`, `snapshot_id`, `code_sha`) — **Owner: DAE**
- [ ] **T4-005** Add golden tests for top report formats — **Owner: DAE**

### Phase 5 — CI/CD + Ops (W7–W8)
- [ ] **T5-001** Branch protections + required checks policy — **Owner: HUM**
- [ ] **T5-002** CI pipeline: lint/typecheck/unit/integration/security/build — **Owner: DAE**
- [ ] **T5-003** Rollback playbook + test — **Owner: PHR/DAE**
- [ ] **T5-004** Observability baseline (logs, metrics, alerts) — **Owner: DAE**
- [ ] **T5-005** Incident runbook + severity matrix — **Owner: PHR**

### Phase 6 — Security Closure (W9)
- [ ] **T6-001** Secrets audit (remove plaintext secrets, env hygiene) — **Owner: DAE**
- [ ] **T6-002** Dependency/SAST scanning in CI — **Owner: DAE**
- [ ] **T6-003** RBAC/least-privilege review — **Owner: HUM/DAE**
- [ ] **T6-004** Security incident playbook tabletop — **Owner: PHR/HUM**

### Phase 7 — Mobile MVP Stabilization (W10)
- [ ] **T7-001** Freeze top 5 mobile workflows — **Owner: HUM**
- [ ] **T7-002** Reduce payloads for mobile critical views — **Owner: DAE**
- [ ] **T7-003** Device matrix test (iOS/Android common sizes) — **Owner: DAE**
- [ ] **T7-004** Internal beta feedback round — **Owner: HUM**

---

## Acceptance Gates (unchanged)
- Data ingestion failures <1%/day.
- 100% datasets have freshness/completeness metrics.
- API p95 read latency <400ms (staging profile).
- 99% report runs in SLA with provenance metadata.
- Rollback validated <10 minutes.
- Zero critical vulnerabilities at release candidate.
- Top 5 workflows mobile-usable; internal beta CSAT ≥8/10.

## Decision Log
- **2026-02-25:** Adopted 10-week phased robustness plan with milestone acceptance criteria.
- **2026-02-25:** Responsive web on phone first; native app deferred.
- **2026-02-25:** Converted board to dynamic Kanban mode (`NOW/NEXT/BLOCKED/DONE`).
