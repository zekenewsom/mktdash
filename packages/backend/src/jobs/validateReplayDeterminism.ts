import { buildReplaySnapshot } from './backfillReplay';

function hashSnapshot(rows: Array<{ key: string; value: number }>) {
  return rows.map((r) => `${r.key}:${r.value}`).join('|');
}

async function run() {
  const days = Number(process.env.REPLAY_DAYS || 7);

  const first = await buildReplaySnapshot(days);
  const second = await buildReplaySnapshot(days);

  const firstHash = hashSnapshot(first);
  const secondHash = hashSnapshot(second);

  const deterministic = firstHash === secondHash;

  console.log('[replay-validate] window_days', days);
  console.log('[replay-validate] first_count', first.length);
  console.log('[replay-validate] second_count', second.length);
  console.log('[replay-validate] deterministic', deterministic);

  if (!deterministic) {
    console.error('[replay-validate] mismatch detected');
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('[replay-validate] failed', err?.message || err);
  process.exit(1);
});
