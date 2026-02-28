# mktdash v1 Institutional Intelligence Spec

Date: 2026-02-27
Status: Draft for execution
Owner: DAE/PHR

## 1) Mission
Build a high-signal market intelligence platform that gives institutional-grade orientation and decision support in under 60 seconds, with full drilldown depth when needed.

Core questions answered every cycle:
1. What regime are we in now?
2. What changed that matters?
3. What invalidates the current view?
4. What should we watch next (24h / 7d)?

## 2) Product Standard (Top-Tier Bar)
- Multi-source, corroborated data
- Confidence/freshness metadata on all key signals
- Cross-asset coherence checks
- Event-driven interpretation, not raw chart dumps
- Explicit base case + alternative + invalidation conditions
- Zero silent fallback substitution

## 3) Information Hierarchy

### Tier 1 — Decision Core (always visible)
1. Regime State Card
2. What Changed Today (Top 3)
3. Invalidation Trigger Panel

### Tier 2 — Context (expandable)
4. Cross-Asset Confirmation Matrix
5. Economic Calendar (7-day, impact-ranked)
6. Headline Intelligence Feed (corroboration count)
7. Data Quality Console

### Tier 3 — Drilldown
8. Time-series chart workspace
9. Correlation regime monitor
10. Event impact tracker
11. Report archive + provenance views

## 4) Data Coverage Requirements

### 4.1 Core Market Data
- Equities: SPX, NQ, Dow (+ breadth when available)
- Rates: UST 2Y/10Y, 2s10s, 3m10y, real yield proxy
- FX: DXY + key majors
- Credit: IG OAS, HY OAS proxies
- Volatility: VIX, MOVE
- Commodities: WTI, Brent, Gold, Copper
- Crypto (supporting risk beta): BTC, ETH

### 4.2 Macro/Event Data
- CPI, Core PCE, unemployment, payrolls, claims, ISM
- Central bank events and policy-relevant releases
- 7-day event calendar with impact ranking
- Curated multi-source headline stream

### 4.3 Data Quality Telemetry
Per dataset/metric:
- freshness age
- completeness
- drift signal
- fallback usage
- source/corroboration metadata
- provider error state

## 5) Signal Engine Requirements

### 5.1 Regime Model (v2 target)
Output:
- state: risk_on | neutral | risk_off
- score: 0–100
- confidence: high | medium | low
- top drivers (3–5)

Inputs (weighted):
- equities momentum/dispersion
- rates direction/curve
- USD trend
- vol regime
- credit stress
- commodity confirmation

### 5.2 What Changed Engine
- Emits top 3 material deltas since last cycle
- Includes category, directional impact, and confidence

### 5.3 Invalidation Engine
- Defines threshold-based invalidation rules
- State per trigger: safe | near | triggered
- Includes expected sensitivity (low/med/high)

### 5.4 Divergence Engine
- Flags cross-asset contradictions
- Scores severity and likely transmission paths

### 5.5 Event Impact Engine
- Tracks surprise vs consensus + multi-horizon reaction matrix

## 6) API Contract Requirements
Mandatory routes:
- `/api/intelligence/overview`
- `/api/health/status`
- `/api/health/metrics`
- `/api/health/data-quality`
- `/api/calendar/events`
- `/api/docs/openapi`

All API responses must use canonical envelope and explicit error codes.

## 7) Confidence & Trust Rules (non-negotiable)
- No metric displayed without `as_of`
- No interpretation without confidence
- No fallback without visible fallback label
- No stale data presented as current
- No unresolved provider error hidden from quality panel

## 8) Performance & Reliability Targets
- p50 API latency: <250ms (staging profile)
- p95 API latency: <1500ms (free-tier realistic), <400ms target for upgraded tier
- error_count on core endpoints: 0 in baseline load tests
- freshness ratio: >=95% target for critical real-time-ish metrics
- completeness ratio: >=99% on core displayed fields

## 9) UX Requirements
- First-screen orientation under 60 seconds
- Clear state semantics using consistent color rules
- Mobile-responsive layout with no clipped critical signals
- Route-level error boundaries and empty/error/offline states on all intelligence modules

## 10) CI/CD Quality Gates
Pipeline must fail on:
- build/type errors
- secret scan failures
- loadtest threshold breaches
- contract/validation failures

Gate thresholds (v1):
- max endpoint errors: 0
- max p95 (local CI profile): configurable env, default 1500ms

## 11) Observability Requirements
- 15-minute rolling request metrics (`p50/p95/max`, by endpoint)
- provider fallback/stale counts in quality endpoint
- drift flags surfaced in telemetry
- baseline reports stored under `docs/`

## 12) Execution Plan Alignment

### Immediate (active)
1. Finalize staging replay validation with non-zero baseline
2. Implement Invalidation Trigger Panel
3. Implement Headline Corroboration Feed
4. Upgrade regime scoring to v2 weighted model

### Near-term
5. Correlation monitor + divergence severity ranking
6. Event impact tracker and replay view
7. Report engine schema and deterministic output pipeline

## 13) Acceptance Criteria (v1 Institutional Readiness)
The spec is considered met when:
1. Tier 1 modules are live with confidence and invalidation support
2. Tier 2 modules are live with corroboration and quality telemetry
3. API + CI quality gates are enforced and passing
4. Staging baseline loadtest and replay validation reports exist
5. Users can answer regime/driver/invalidation/watchlist questions in one screen

## 14) Out-of-Scope for v1
- Full OMS/execution integration
- Proprietary alt-data procurement
- Automated strategy deployment

---
This document is the canonical product-quality target for “high-signal, hedge-fund-grade” mktdash execution.