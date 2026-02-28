# ARCHITECTURE_V2 Task Breakdown (A1–A30)

## Phase 1 — Signal Foundation
- A1 Feature registry schema + validator
- A2 Implement 20-feature ingestion set
- A3 Add transforms library (mom, zscore, drawdown, slope)
- A4 Build `/api/signals/features`
- A5 Build `/api/signals/regime` v0
- A6 Add attribution payload (`top_5_contributors`)

## Phase 2 — Thesis Engine v1
- A7 Thesis contract schema (`base/alt/invalidation`)
- A8 Priors config by regime family
- A9 Evidence updater (weighted log-odds)
- A10 Probability normalization + simplex tests
- A11 `/api/thesis/current`
- A12 `/api/thesis/history`

## Phase 3 — Weighting + Quality Intelligence
- A13 Sleeve weights config (strategic)
- A14 Dynamic quality weights (freshness/fallback)
- A15 Regime relevance weights
- A16 Recency decay weights
- A17 Correlation penalty module
- A18 Confidence decomposition endpoint + UI

## Phase 4 — Governance + Drift Ops
- A19 Model registry file + version manifest
- A20 Model card template + first card
- A21 Input drift checks (PSI/KS-lite)
- A22 Coverage/latency drift checks
- A23 Degraded-mode confidence cap logic
- A24 Argus drift alert integration

## Phase 5 — Production Hardening
- A25 CI gates for signal contracts + latency budgets
- A26 Replay determinism regression tests
- A27 Daily pipeline success monitor + SLO burn view
- A28 Incident runbook for model regressions
- A29 Canary rollout for weight updates
- A30 Release checklist + approval workflow
