# mktdash Module Value Audit (Info-First)

Date: 2026-02-27
Scope: Information quality and decision utility only (not backend architecture)
Scoring: 1 (low) -> 5 (high)

Evaluation criteria:
1. Regime clarity
2. Change detection value
3. Invalidation usefulness
4. Confidence transparency
5. Actionability

## Summary
- Current dashboard is functional but mostly **Tier-2/Tier-3 scaffold**.
- Highest-value additions for v1 are: **Regime State**, **What Changed**, **Invalidation Triggers**, **Economic Calendar**, and **Data Quality Console**.
- Existing placeholders (NewsFeed, ReportViewer) should not ship as-is; they reduce trust.

## Current Modules (as implemented now)

| Module | Regime Clarity | Change Detection | Invalidation Usefulness | Confidence Transparency | Actionability | Total (/25) | Decision |
|---|---:|---:|---:|---:|---:|---:|---|
| MarketOverviewCard (SP500/Nasdaq/DJIA + macro) | 3 | 2 | 1 | 1 | 2 | 9 | Keep, redesign into Regime State Card |
| IndexChart (single selected series history) | 2 | 2 | 1 | 1 | 2 | 8 | Keep as drilldown, not top-level |
| TableContainer placeholder | 1 | 1 | 1 | 1 | 1 | 5 | Replace with Cross-Asset Confirmation Matrix |
| NewsFeed placeholder | 1 | 2 | 1 | 1 | 1 | 6 | Replace with corroborated headline intelligence |
| ReportViewer placeholder | 1 | 1 | 1 | 1 | 1 | 5 | Demote to later phase (P2) |

## Target v1 Module Stack (ranked)

| Priority | Module | Purpose | Must-have fields |
|---:|---|---|---|
| 1 | Regime State Card | Instant market orientation | regime_state, confidence, top_drivers[3], as_of |
| 2 | What Changed Today | Surface only material deltas | change_type, magnitude, relevance, as_of |
| 3 | Invalidation Trigger Panel | Show what breaks the base case | trigger, threshold, status, sensitivity |
| 4 | 7-Day Economic Calendar | Forward catalyst awareness | event, time, impact_rank, expected_sensitivity |
| 5 | Headline Intelligence Feed | Multi-source corroboration | cluster_id, headline, source_count, confidence |
| 6 | Cross-Asset Confirmation Matrix | Confirm/diverge against regime | asset_bucket, signal_direction, confirms_regime |
| 7 | Data Quality Console | Trust and reliability visibility | freshness_age, source, fallback_used, quality_flags |

## Gaps to Close for “Best-in-Class”
1. No explicit **base case + invalidation** model in UI.
2. No explicit **confidence + freshness** metadata displayed.
3. No clear separation between confirmed and developing information.
4. No strict info hierarchy (critical vs contextual vs drilldown).

## Product Rules (applies to all modules)
- No metric without `as_of`.
- No interpretation without confidence class.
- No alert without “why this matters.”
- No fallback data without visible fallback badge.
- No top-level module that does not improve one of:
  - What regime?
  - What changed?
  - What invalidates?

## Final Launch Layout (v1)

Top row (always visible):
1. Regime State Card
2. What Changed Today
3. Invalidation Trigger Panel

Middle row:
4. Cross-Asset Confirmation Matrix
5. Macro Pulse + 7-Day Calendar

Lower row:
6. Headline Intelligence Feed
7. Data Quality Console

Drilldown tabs:
- IndexChart
- Correlation monitor
- Event impact details
- Report viewer (later)
