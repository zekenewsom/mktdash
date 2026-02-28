import { fetchIntelligenceOverview } from './intelligenceService';

export type DriftState = 'green' | 'yellow' | 'red';

export async function assessDriftState() {
  const overview = await fetchIntelligenceOverview();
  const quality = overview.data.quality;

  const totalSignals = Math.max(1, quality.sources.length || 1);
  const staleRatio = quality.stale_count / totalSignals;
  const fallback = quality.fallback_used;

  let state: DriftState = 'green';
  let confidenceCap: 'high' | 'medium' | 'low' = 'high';

  if (fallback || staleRatio >= 0.4) {
    state = 'red';
    confidenceCap = 'low';
  } else if (staleRatio >= 0.2 || quality.stale_used) {
    state = 'yellow';
    confidenceCap = 'medium';
  }

  return {
    data: {
      as_of: new Date().toISOString(),
      state,
      confidence_cap: confidenceCap,
      stale_ratio: Number(staleRatio.toFixed(3)),
      stale_count: quality.stale_count,
      fallback_used: fallback,
    },
    error: overview.error,
  };
}
