# Accessibility & Mobile Quick Audit — 2026-02-27

Scope: critical dashboard surfaces (top-row intelligence, chart area, context row)

## Findings

1. Landmark semantics were missing for the main dashboard container.
2. Mobile spacing/height constraints for chart view were too rigid on small screens.
3. Error handling existed, but route-level fallback experience needed a consistent boundary.

## Fixes applied

- Added `<main aria-label="mktdash dashboard">` wrapper in dashboard page.
- Updated chart container for mobile-responsive sizing:
  - reduced small-screen padding
  - lowered minimum chart height on mobile
  - improved responsive heading size
- Added route-level `ErrorBoundary` wrapper in app shell (implemented earlier in this sprint).

## Remaining recommendations (next pass)

1. Add keyboard-focus visible styles to all table row interactions.
2. Add aria-live region for backend/network status changes.
3. Improve color contrast for warning badges in dark mode.
4. Add automated a11y checks in CI (axe/lighthouse step).

## Outcome

- Critical UX resilience checks now pass for mobile spacing + route-level crash containment.
- Baseline a11y posture is improved; automation is still pending.
