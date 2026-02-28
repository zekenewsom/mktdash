# mktdash Architecture V2 — Institutional / Hedge-Fund Grade

Date: 2026-02-28
Status: Active execution architecture

## Why redesign
Current regime + changes are too narrow for institutional use. We are moving from a 3-signal heuristic to a multi-sleeve probabilistic intelligence system.

## Target system

### 1) Signal sleeves (42-feature architecture)
- Equities (8)
- Rates (8)
- FX (6)
- Credit (6)
- Volatility (6)
- Commodities + Macro (8)

Each feature has:
- source
- transform
- freshness SLA
- quality weight
- regime relevance weight

### 2) Regime model v2+
Outputs:
- latent dimensions: growth, inflation, liquidity, risk appetite
- regime class: risk-on / neutral / risk-off family
- confidence + stability
- top contributor attribution

### 3) Dynamic thesis engine
For each cycle, produce:
- base thesis + probability
- alt thesis #1/#2 + probability
- explicit invalidation triggers
- expected cross-asset map

### 4) Data quality + model governance
- freshness/completeness/drift
- stale/fallback confidence haircut
- model registry + versioning
- drift monitors + degraded mode

### 5) Ops controls
- SLOs: availability, latency, freshness, quality
- alert policy with actionable threshold
- replay/audit lineage and runbooks

## Phased execution

## Phase A — Data Universe Expansion (Immediate)
- Expand intelligence metrics from 12 to 30+
- Add credit/vol/fx breadth where free-source available
- Add feature registry file and weight metadata

## Phase B — Probabilistic Thesis Engine
- Introduce thesis schema + probability updates
- Add base/alt/invalidation API outputs

## Phase C — Institutional UI Upgrade
- Add thesis panel
- Add contributor attribution panel
- Add event impact reaction matrix

## Phase D — Governance + Reliability
- model versioning
- drift alerts
- replay validation in staging
- SLO enforcement in CI + runtime

## Acceptance criteria
1. Regime decisions no longer depend on <=3 inputs
2. 30+ high-signal metrics active with quality telemetry
3. Thesis output contains base/alt/invalidation with probabilities
4. API and UI expose confidence + provenance on all key outputs
5. Replay/determinism and SLO controls are operational
