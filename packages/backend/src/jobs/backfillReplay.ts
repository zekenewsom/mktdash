import fs from 'fs';
import path from 'path';
import { fetchFredSeriesHistory } from '../services/marketDataService';

type ReplayRow = {
  key: string;
  symbol: string;
  as_of: string;
  value: number;
  source: string;
};

const DEFAULT_SERIES = ['SP500', 'NASDAQCOM', 'DJIA', 'FEDFUNDS', 'CPIAUCSL', 'UNRATE'];

export async function buildReplaySnapshot(days = 7, seriesIds: string[] = DEFAULT_SERIES) {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const map = new Map<string, ReplayRow>();

  for (const seriesId of seriesIds) {
    const result = await fetchFredSeriesHistory(seriesId);
    const rows = (result.data || []).filter((r) => r.as_of >= cutoff);

    for (const row of rows) {
      const key = `${row.symbol}:${row.as_of}`;
      if (!map.has(key)) {
        map.set(key, {
          key,
          symbol: row.symbol,
          as_of: row.as_of,
          value: row.value,
          source: row.source,
        });
      }
    }
  }

  const snapshot = Array.from(map.values()).sort((a, b) => {
    if (a.symbol === b.symbol) return a.as_of.localeCompare(b.as_of);
    return a.symbol.localeCompare(b.symbol);
  });

  return snapshot;
}

function summarize(snapshot: ReplayRow[]) {
  const bySymbol = snapshot.reduce<Record<string, number>>((acc, r) => {
    acc[r.symbol] = (acc[r.symbol] || 0) + 1;
    return acc;
  }, {});
  return { total_rows: snapshot.length, by_symbol: bySymbol };
}

export async function runBackfillReplay(days = 7) {
  const snapshot = await buildReplaySnapshot(days);
  const summary = summarize(snapshot);

  const outputDir = path.resolve(process.cwd(), 'artifacts/replay');
  fs.mkdirSync(outputDir, { recursive: true });

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outPath = path.join(outputDir, `backfill-${stamp}.jsonl`);

  const header = {
    type: 'meta',
    generated_at: new Date().toISOString(),
    window_days: days,
    summary,
  };

  const lines = [JSON.stringify(header), ...snapshot.map((r) => JSON.stringify(r))].join('\n');
  fs.writeFileSync(outPath, `${lines}\n`, 'utf8');

  return { outPath, summary };
}

if (require.main === module) {
  const days = Number(process.env.REPLAY_DAYS || 7);
  runBackfillReplay(days)
    .then(({ outPath, summary }) => {
      console.log('[backfill-replay] wrote', outPath);
      console.log('[backfill-replay] summary', JSON.stringify(summary));
    })
    .catch((err) => {
      console.error('[backfill-replay] failed', err?.message || err);
      process.exit(1);
    });
}
