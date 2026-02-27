# Backfill Replay Runbook (T1-008)

## Purpose
Rebuild recent market/macro snapshots deterministically over a 7-day window and verify replay stability.

## Commands
From repo root:

```bash
corepack pnpm --filter backend backfill:replay
corepack pnpm --filter backend backfill:validate
```

Optional custom window:

```bash
REPLAY_DAYS=14 corepack pnpm --filter backend backfill:replay
REPLAY_DAYS=14 corepack pnpm --filter backend backfill:validate
```

## Outputs
- Replay artifact JSONL:
  - `packages/backend/artifacts/replay/backfill-<timestamp>.jsonl`
- First line is `meta` summary, subsequent lines are replay rows.

## Idempotency Rules
- Unique row key: `symbol:as_of`
- Duplicate keys are ignored on replay build.
- Rows are sorted by `symbol`, then `as_of` before writing.

## Validation Criteria
- `backfill:validate` must print `deterministic true`
- `first_count` equals `second_count`
- No process exit errors

## Rollback / Failure Handling
1. If command fails, verify `FRED_API_KEY` and network access.
2. Retry once with same `REPLAY_DAYS`.
3. If still failing, set `DATA_PROVIDER_MODE=mock_only` and rerun to isolate provider issue.
4. Record incident in ops notes and do not publish replay artifact as canonical.

## Operational Notes
- This replay is for robustness validation and historical consistency checks.
- It does not mutate primary serving endpoints directly.
