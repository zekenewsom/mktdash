# mktdash Coding + Commit Plan (Info-First v1)

Date: 2026-02-27
Goal: Start implementation with disciplined, small, reviewable commits tied to information-value milestones.

## Current Status Snapshot
- ✅ Plan/spec direction exists (P0 data robustness + info architecture)
- ✅ Basic frontend/dashboard scaffold exists
- ✅ FRED-backed endpoints exist
- ⚠️ Major modules are placeholders (news/report/table)
- ⚠️ No confidence/freshness-first UI contract yet

## Delivery Strategy
Use short vertical slices. Each slice must produce:
1) user-visible value,
2) testable acceptance criteria,
3) one concise commit (or small commit set).

## Branching + Commit Convention
- Branch name: `feat/<milestone>-<short-desc>`
- Commit format: `<area>: <change> (MKTD-P0-xx)`
  - Example: `frontend: add Regime State card shell (MKTD-P0-11)`
- Prefer 1 logical change per commit.
- Every commit message includes task id.

## Sprint 1 (Next 5 coding sessions)

### Session 1 — Define frontend info contracts
Tasks:
- Add `packages/frontend/src/contracts/intelligence.ts`
- Define interfaces for:
  - `RegimeState`
  - `MaterialChange`
  - `InvalidationTrigger`
  - `QualityBadge`
Acceptance:
- Types compile
- No `any` in new contracts
Commit:
- `frontend: add intelligence contract types (MKTD-P0-11)`

### Session 2 — Build Regime State + What Changed UI (static wired)
Tasks:
- Create components:
  - `RegimeStateCard.tsx`
  - `WhatChangedPanel.tsx`
- Mount on dashboard above existing modules
Acceptance:
- Components render with mock fixture data
- Responsive layout on mobile + desktop
Commit:
- `frontend: add regime and change panels to dashboard (MKTD-P0-12)`

### Session 3 — Add Invalidation Trigger Panel + confidence labels
Tasks:
- Create `InvalidationPanel.tsx`
- Add confidence/freshness badges component
Acceptance:
- Each trigger shows threshold + status + sensitivity
- Badge style map (high/med/low, stale/fallback) is consistent
Commit:
- `frontend: add invalidation panel and confidence badges (MKTD-P0-13)`

### Session 4 — Replace News placeholder with corroborated feed shell
Tasks:
- Replace `NewsFeed` placeholder UI with cluster-oriented layout
- Show `source_count`, `confidence`, `as_of`
Acceptance:
- Feed cards support confirmed vs developing states
- No placeholder text remains
Commit:
- `frontend: replace news placeholder with corroboration feed shell (MKTD-P0-14)`

### Session 5 — Add Data Quality Console and remove trust-erosion elements
Tasks:
- Create `DataQualityConsole.tsx`
- Hide/demote `ReportViewer` placeholder from main dashboard
Acceptance:
- Quality console visible on dashboard
- Main view contains only meaningful modules
Commit:
- `frontend: add data quality console and clean dashboard surface (MKTD-P0-15)`

## Session-Level Done Checklist (run every coding pass)
- [ ] Build passes locally
- [ ] Lint passes (if configured)
- [ ] UI loads without runtime errors
- [ ] New module has `as_of` + confidence path (or TODO explicitly tracked)
- [ ] Commit made with task id and clear scope

## Review Cadence
- Daily: post short progress update (done / next / blocked)
- Every 2 sessions: re-check module audit scores
- End of Sprint 1: decide whether to begin backend integration for new modules

## Non-Negotiables
- No shipping placeholders as production modules.
- No silent fallback presentation.
- No top-level panel without clear decision utility.
