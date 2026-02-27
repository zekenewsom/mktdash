# mktdash — Dynamic Ops Board

Last updated: 2026-02-27 13:55 EST
Status: ACTIVE
Mode: Rolling Kanban (dynamic reprioritization)

## Owners
- **DAE** = Daedalus (coordination + implementation)
- **PHR** = Phronesis (ops planning/checklists)
- **HUM** = You (approvals, priorities, product decisions)

---

## NOW (recalibrated next 72h)
- [x] **S3-001** Finish ingestion quality metrics (`T1-004`): freshness/completeness/drift for intelligence + calendar + quality datasets — **Owner: DAE**
- [x] **S3-002** Build idempotent replay/backfill job (`T1-007`) with 7-day window and deterministic keys — **Owner: DAE**
- [x] **S3-003** Author replay runbook (`T1-008`) with rollback/retry procedure — **Owner: PHR/DAE**
- [x] **S3-004** Validate deterministic replay counts (`T1-009`) with acceptance report — **Owner: DAE**
- [x] **S3-005** Add request timing + p95 telemetry (`T2-004`) and expose metrics endpoint — **Owner: DAE**
- [x] **S3-006** Add provider cache + timeout/retry policy (`T2-005`) for FRED/calendar — **Owner: DAE**
- [ ] **S3-007** Frontend resilience pass 1 (`T3-001`): standard loading/empty/error/offline states for all intelligence cards — **Owner: DAE**
- [ ] **S3-008** Run replay/backfill validation in staging env with live provider keys and capture non-zero baseline report — **Owner: DAE**

## NEXT (queued / this week)
- [x] **T1-001** Create canonical market data schemas (`symbol`, `source`, `as_of`, `value`, `unit`, `quality_flags`) — **Owner: DAE**
- [x] **T1-002** Add schema versioning strategy + migration notes (`docs/data-contracts.md`) — **Owner: DAE**
- [x] **T1-003** Wire validation into ingestion entrypoints — **Owner: DAE**
- [x] **T1-004** Add freshness/completeness/drift metrics per dataset — **Owner: DAE**
- [x] **T1-005** Expose `/api/health/data-quality` endpoint — **Owner: DAE**
- [x] **T1-006** Add frontend quality panel placeholder — **Owner: DAE**

## BLOCKED (waiting on decision/input)
- [ ] **B-009** Confirm report-engine v1 scope before Phase 4 starts (`T4-001` format, sections, and output cadence) — **Owner: HUM**

## DONE
- [x] **D-001** Initial 10-week robustness plan drafted by PHR
- [x] **D-002** Initial execution board created (`TASK_STATE.md`)
- [x] **D-003** Local preview stack bootstrapped (frontend/backend run confirmed)
- [x] **D-004** Backend env behavior stabilized with provider mode + timeout defaults
- [x] **D-005** Canonical data contract + API error envelope scaffolded

---

## BACKLOG (milestone-indexed)

### Phase 1 — Data Layer Hardening (W1–W2)
- [x] **T1-007** Implement idempotent replay job (7-day window) — **Owner: DAE**
- [x] **T1-008** Write runbook (`runbooks/backfill-replay.md`) — **Owner: PHR**
- [x] **T1-009** Validate deterministic replay counts ±0.1% — **Owner: DAE**

### Phase 2 — Backend/API Quality (W3–W4)
- [ ] **T2-001** Define error envelope and API response shape — **Owner: DAE**
- [ ] **T2-002** Generate OpenAPI spec for all existing routes — **Owner: DAE**
- [ ] **T2-003** Publish docs endpoint/static artifact — **Owner: DAE**
- [x] **T2-004** Add request timing + p95 metrics — **Owner: DAE**
- [x] **T2-005** Add caching + timeout/retry policy by provider — **Owner: DAE**
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
- **2026-02-27:** Access path set to private tailnet-only.
- **2026-02-27:** Staging target set to free-tier combo: Vercel (frontend) + Render (backend).
- **2026-02-27:** Key hygiene decision set to rotate now.
- **2026-02-27:** Tailscale confirmed active on all systems.
- **2026-02-27:** Render and Vercel project connections confirmed.
- **2026-02-27:** Vercel env + redeploy confirmed; frontend now points to Render backend URL.
- **2026-02-27:** Key rotation confirmed complete by human.
- **2026-02-27:** Plan recalibrated to prioritize ingestion hardening + observability before broader API/UX expansion.
- **2026-02-27:** Completed ingestion hardening + observability tranche (`T1-004`, `T1-007..009`, `T2-004..005`), with staging replay validation queued.
