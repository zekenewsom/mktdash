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
- [x] **V2-001** Build feature registry (30+ metrics) with source/SLA/weights metadata — **Owner: DAE/SOPHIA**
- [x] **V2-002** Expand backend metrics architecture for multi-sleeve V2 (`/api/intelligence/metrics` + `/api/signals/features` seed set) — **Owner: DAE**
- [x] **V2-003** Implement thesis object schema + `/api/thesis/current` — **Owner: DAE/HEAVY**
- [x] **V2-004** Add base/alt/invalidation probability panel in frontend — **Owner: DAE**
- [x] **V2-005** Add contributor attribution panel (why regime score moved) — **Owner: DAE**
- [x] **V2-006** Add drift checks + degraded mode confidence cap — **Owner: DAE/ARGUS**
- [x] **V2-007** Execute A1–A6 (Signal Foundation) from `docs/ARCHITECTURE_V2_TASK_BREAKDOWN.md` — **Owner: DAE**
- [x] **V2-008** Execute A7–A12 (Thesis Engine v1) — **Owner: DAE/HEAVY**
- [ ] **V2-009** Execute A13–A18 (Weighting + Quality Intelligence) — **Owner: DAE**
- [x] **V2-011** Expand live metric universe from ~12 to 30+ active feeds and map sleeves to effective weights — **Owner: DAE/SOPHIA**
- [x] **V2-012** Persist thesis history to artifacts store with replayable snapshots and add `/api/thesis/history` integrity checks — **Owner: DAE**
- [ ] **V2-013** Add sleeve-level weighted contribution stats to frontend attribution panel — **Owner: DAE**
- [ ] **V2-010** Execute A19–A24 (Governance + Drift Ops) — **Owner: DAE/ARGUS**
- [x] **S4-001** Regime v2 rollout: weighted factor scoring in intelligence overview — **Owner: DAE**
- [x] **S4-002** Add Invalidation Trigger Panel end-to-end (API + UI) — **Owner: DAE**
- [x] **S4-003** Add Headline Intelligence Feed with source corroboration counts — **Owner: DAE**
- [x] **S4-004** Expand market metrics panel from 6 to 12+ institutional metrics and wire endpoint — **Owner: DAE**
- [x] **S4-005** Fix chart rendering contract mismatch (`as_of` -> `date`) in dashboard history mapping — **Owner: DAE**
- [x] **S3-002** Build idempotent replay/backfill job (`T1-007`) with 7-day window and deterministic keys — **Owner: DAE**
- [x] **S3-003** Author replay runbook (`T1-008`) with rollback/retry procedure — **Owner: PHR/DAE**
- [x] **S3-004** Validate deterministic replay counts (`T1-009`) with acceptance report — **Owner: DAE**
- [x] **S3-005** Add request timing + p95 telemetry (`T2-004`) and expose metrics endpoint — **Owner: DAE**
- [x] **S3-006** Add provider cache + timeout/retry policy (`T2-005`) for FRED/calendar — **Owner: DAE**
- [x] **S3-007** Frontend resilience pass 1 (`T3-001`): standard loading/empty/error/offline states for all intelligence cards — **Owner: DAE**
- [ ] **S3-008** Run replay/backfill validation in staging env with live provider keys and capture non-zero baseline report — **Owner: DAE**
- [x] **S3-012** Execute load test baseline on staging endpoints and capture p50/p95/error rates — **Owner: DAE**
- [x] **S3-013** Tune rate-limit thresholds and add endpoint-specific policy defaults for staging vs prod — **Owner: DAE**
- [ ] **S3-014** Deploy latest backend/frontend commits and re-verify dashboard modules from Vercel in-browser — **Owner: DAE/HUM**
- [x] **S3-009** Staging smoke-test new observability endpoints (`/api/health/metrics`, enhanced `/api/health/data-quality`) after deploy — **Owner: DAE**
- [x] **S3-010** API quality pass: generate OpenAPI spec for live routes (`T2-002`) — **Owner: DAE**
- [x] **S3-011** API quality pass: publish docs artifact endpoint (`T2-003`) — **Owner: DAE**

## NEXT (queued / this week)
- [x] **T1-001** Create canonical market data schemas (`symbol`, `source`, `as_of`, `value`, `unit`, `quality_flags`) — **Owner: DAE**
- [x] **T1-002** Add schema versioning strategy + migration notes (`docs/data-contracts.md`) — **Owner: DAE**
- [x] **T1-003** Wire validation into ingestion entrypoints — **Owner: DAE**
- [x] **T1-004** Add freshness/completeness/drift metrics per dataset — **Owner: DAE**
- [x] **T1-005** Expose `/api/health/data-quality` endpoint — **Owner: DAE**
- [x] **T1-006** Add frontend quality panel placeholder — **Owner: DAE**

## BLOCKED (waiting on decision/input)
- [ ] **B-011** Confirm report delivery surface for v1 (`API JSON only` vs `PDF export in-app`) — **Owner: HUM**
- [ ] **B-012** Approve Architecture V2 institutional redesign (`docs/ARCHITECTURE_V2_HEDGE_FUND.md`) as canonical target — **Owner: HUM**

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
- [x] **T2-001** Define error envelope and API response shape — **Owner: DAE**
- [x] **T2-002** Generate OpenAPI spec for all existing routes — **Owner: DAE**
- [x] **T2-003** Publish docs endpoint/static artifact — **Owner: DAE**
- [x] **T2-004** Add request timing + p95 metrics — **Owner: DAE**
- [x] **T2-005** Add caching + timeout/retry policy by provider — **Owner: DAE**
- [x] **T2-006** Add rate limiting + abuse controls — **Owner: DAE**
- [x] **T2-007** Add load tests for top 5 endpoints — **Owner: DAE**
- [x] **T2-008** Add CI gate for latency/error thresholds — **Owner: DAE**

### Phase 3 — Frontend UX Resilience (W3–W4 overlap)
- [x] **T3-001** Standard loading/empty/error/offline states — **Owner: DAE**
- [x] **T3-002** Route-level error boundaries — **Owner: DAE**
- [x] **T3-003** Mobile breakpoints + chart responsiveness pass — **Owner: DAE**
- [x] **T3-004** A11y quick audit (critical WCAG checks) — **Owner: DAE**

### Phase 4 — Report Engine Pipeline (W5–W6)
- [x] **T4-001** Define report template schema + input contract — **Owner: PHR/DAE**
- [x] **T4-002** Implement deterministic generation pipeline — **Owner: DAE**
- [ ] **T4-003** Add queue/retry/dead-letter flow — **Owner: DAE**
- [x] **T4-004** Add provenance metadata (`run_id`, `snapshot_id`, `code_sha`) — **Owner: DAE**
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
- **2026-02-27:** Completed API docs tranche (`T2-002`, `T2-003`) with `openapi.yaml` artifact and `/api/docs/openapi` endpoint.
- **2026-02-27:** Added baseline rate limiting + staging load-test harness (`T2-006`, `T2-007`); observed high p95 under free-tier cold starts.
- **2026-02-27:** Applied CORS hotfix on backend to resolve cross-origin frontend network errors in Vercel->Render staging flow.
- **2026-02-27:** Added CI workflow with local latency/error gate and implemented frontend error boundary (`T2-008`, `T3-002`).
- **2026-02-27:** Completed rate-limit policy tuning + mobile responsiveness + quick accessibility audit (`S3-013`, `T3-003`, `T3-004`).
- **2026-02-27:** Institutional spec approved by human; executed next sprint: regime v2 + invalidation panel + headline corroboration feed.
- **2026-02-27:** Expanded core metrics coverage (12+) and fixed chart data contract mismatch causing blank chart states.
- **2026-02-27:** Began Phase 4 execution with deterministic report engine v1 schema, generator, and provenance metadata endpoint integration.
- **2026-02-28:** Added V2 signal/thesis endpoints and frontend thesis+attribution panels (`/api/signals/*`, `/api/thesis/*`).
- **2026-02-28:** Added drift status endpoint and degraded-mode confidence cap wiring (`/api/health/drift`, capped regime confidence).
- **2026-02-28:** Upgraded thesis engine with evidence model + persisted history and expanded metric universe target to 30+.
- **2026-02-28:** Implemented feature registry-backed effective weights and thesis history integrity checks (`checksum`) for replay confidence.
