# mktdash — Execution Board (10-Week Robustness Plan)

Last updated: 2026-02-25
Status: ACTIVE

## Owners
- **DAE** = Daedalus (coordination + implementation)
- **PHR** = Phronesis (ops planning/checklists)
- **HUM** = You (approvals, priorities, product decisions)

---

## Phase 1 (Weeks 1–2): Data Layer Hardening

### M1.1 Source schema registry + versioning
- [ ] **T1-001** Create canonical market data schemas (`symbol`, `source`, `as_of`, `value`, `unit`, `quality_flags`) — **Owner: DAE** — **Due: W1D2**
- [ ] **T1-002** Add schema versioning strategy + migration notes (`docs/data-contracts.md`) — **Owner: DAE** — **Due: W1D3**
- [ ] **T1-003** Wire validation into ingestion entrypoints — **Owner: DAE** — **Due: W1D5**
- **DoD:** 100% ingestion paths validate against versioned schema.

### M1.2 Data quality dashboard live
- [ ] **T1-004** Add freshness/completeness/drift metrics per dataset — **Owner: DAE** — **Due: W2D2**
- [ ] **T1-005** Expose `/api/health/data-quality` endpoint — **Owner: DAE** — **Due: W2D3**
- [ ] **T1-006** Add frontend quality panel placeholder — **Owner: DAE** — **Due: W2D4**
- **DoD:** All datasets show freshness + completeness + drift status.

### M1.3 Backfill runbook tested
- [ ] **T1-007** Implement idempotent replay job (7-day window) — **Owner: DAE** — **Due: W2D4**
- [ ] **T1-008** Write runbook (`runbooks/backfill-replay.md`) — **Owner: PHR** — **Due: W2D5**
- [ ] **T1-009** Validate deterministic replay counts ±0.1% — **Owner: DAE** — **Due: W2D5**
- **DoD:** Replay run succeeds twice with deterministic counts.

---

## Phase 2 (Weeks 3–4): Backend/API Quality

### M2.1 OpenAPI + docs
- [ ] **T2-001** Define error envelope and API response shape — **Owner: DAE**
- [ ] **T2-002** Generate OpenAPI spec for all existing routes — **Owner: DAE**
- [ ] **T2-003** Publish docs endpoint/static artifact — **Owner: DAE**
- **DoD:** OpenAPI committed and CI-validated.

### M2.2 Performance baseline
- [ ] **T2-004** Add request timing + p95 metrics — **Owner: DAE**
- [ ] **T2-005** Add caching + timeout/retry policy by provider — **Owner: DAE**
- [ ] **T2-006** Add rate limiting + abuse controls — **Owner: DAE**
- **DoD:** p95 < 400ms on key read endpoints in staging profile.

### M2.3 Load-test gate
- [ ] **T2-007** Add load tests for top 5 endpoints — **Owner: DAE**
- [ ] **T2-008** Add CI gate for latency/error thresholds — **Owner: DAE**
- **DoD:** CI fails when latency/error budget regress.

---

## Phase 3 (Weeks 3–4 overlap): Frontend UX Resilience

- [ ] **T3-001** Standard loading/empty/error/offline component states — **Owner: DAE**
- [ ] **T3-002** Route-level error boundaries — **Owner: DAE**
- [ ] **T3-003** Mobile breakpoints + chart responsiveness pass — **Owner: DAE**
- [ ] **T3-004** A11y quick audit (critical WCAG checks) — **Owner: DAE**
- **DoD:** No blank-screen failure on core routes; mobile TTI target tracked.

---

## Phase 4 (Weeks 5–6): Report Engine Pipeline

- [ ] **T4-001** Define report template schema + input contract — **Owner: PHR/DAE**
- [ ] **T4-002** Implement deterministic generation pipeline — **Owner: DAE**
- [ ] **T4-003** Add queue/retry/dead-letter flow — **Owner: DAE**
- [ ] **T4-004** Add provenance metadata (`run_id`, `snapshot_id`, `code_sha`) — **Owner: DAE**
- [ ] **T4-005** Add golden tests for top report formats — **Owner: DAE**
- **DoD:** 99% in-SLA report runs; every report traceable.

---

## Phase 5 (Weeks 7–8): CI/CD + Ops

- [ ] **T5-001** Branch protections + required checks policy — **Owner: HUM**
- [ ] **T5-002** CI pipeline: lint/typecheck/unit/integration/security/build — **Owner: DAE**
- [ ] **T5-003** Rollback playbook + test — **Owner: PHR/DAE**
- [ ] **T5-004** Observability baseline (logs, metrics, alerts) — **Owner: DAE**
- [ ] **T5-005** Incident runbook + severity matrix — **Owner: PHR**
- **DoD:** Rollback <10m validated; MTTR process documented.

---

## Phase 6 (Week 9): Security Closure

- [ ] **T6-001** Secrets audit (remove plaintext secrets, env hygiene) — **Owner: DAE**
- [ ] **T6-002** Dependency/SAST scanning in CI — **Owner: DAE**
- [ ] **T6-003** RBAC/least-privilege review — **Owner: HUM/DAE**
- [ ] **T6-004** Security incident playbook tabletop — **Owner: PHR/HUM**
- **DoD:** Zero critical vulns open in release candidate.

---

## Phase 7 (Week 10): Mobile MVP Stabilization

- [ ] **T7-001** Freeze top 5 mobile workflows — **Owner: HUM**
- [ ] **T7-002** Reduce payloads for mobile critical views — **Owner: DAE**
- [ ] **T7-003** Device matrix test (iOS/Android common sizes) — **Owner: DAE**
- [ ] **T7-004** Internal beta feedback round — **Owner: HUM**
- **DoD:** Top 5 workflows pass on mobile browser; CSAT ≥ 8/10.

---

## Current Sprint (Now)

- [ ] **S0-001** Keep phone preview running + verify external reachability
- [ ] **S0-002** Set backend `.env` for stable data-source behavior
- [ ] **S1-001** Start canonical schema file + API error envelope
- [ ] **S1-002** Add basic health endpoint for service/data freshness

---

## Decision Log
- **2026-02-25:** Adopted 10-week phased robustness plan with milestone acceptance criteria.
- **2026-02-25:** Responsive web on phone first; native app deferred.

---

## Risks / Blockers
- No shared production environment yet.
- Monitoring/alert stack not configured.
- Mobile accessibility depends on network exposure method.
