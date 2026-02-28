import { FEATURE_REGISTRY } from '../config/featureRegistry';
import { fetchIntelligenceMetrics } from './signalSources';

export interface QualityScore {
  sleeve: string;
  coverage: number;      // % of metrics with non-null values
  freshness: number;     // % of metrics with fresh data
  quality: number;       // overall quality 0-100
}

export async function assessSleeveQuality() {
  const metrics = await fetchIntelligenceMetrics();
  const data = metrics.data || {};

  const sleeveMetrics: Record<string, string[]> = {};
  for (const spec of FEATURE_REGISTRY) {
    if (!sleeveMetrics[spec.sleeve]) sleeveMetrics[spec.sleeve] = [];
    sleeveMetrics[spec.sleeve].push(spec.symbol);
  }

  const results: QualityScore[] = [];
  const now = Date.now();

  for (const [sleeve, symbols] of Object.entries(sleeveMetrics)) {
    let covered = 0;
    let fresh = 0;

    for (const sym of symbols) {
      const m = data[sym];
      if (m?.value != null) covered++;
      if (m?.as_of) {
        const age = (now - new Date(m.as_of).getTime()) / (1000 * 60 * 60 * 24);
        if (age < 7) fresh++;
      }
    }

    const coverage = symbols.length > 0 ? (covered / symbols.length) * 100 : 0;
    const freshness = symbols.length > 0 ? (fresh / symbols.length) * 100 : 0;
    const quality = Math.round((coverage * 0.6 + freshness * 0.4));

    results.push({ sleeve, coverage: Math.round(coverage), freshness: Math.round(freshness), quality });
  }

  const overall = results.length > 0 ? Math.round(results.reduce((a, b) => a + b.quality, 0) / results.length) : 0;

  return {
    data: {
      as_of: new Date().toISOString(),
      overall_quality: overall,
      sleeves: results,
    },
    error: metrics.error,
  };
}
