import { fetchIntelligenceMetrics } from './signalSources';
import { fetchIntelligenceOverview } from './intelligenceService';
import { assessDriftState } from './driftService';
import { FEATURE_REGISTRY } from '../config/featureRegistry';

function ageMinutes(asOf?: string | null) {
  if (!asOf) return null;
  const ts = Date.parse(asOf);
  if (Number.isNaN(ts)) return null;
  return Math.round((Date.now() - ts) / (1000 * 60));
}

export async function buildSignalFeatures() {
  const metricsResult = await fetchIntelligenceMetrics();
  const metrics = metricsResult.data || {};

  const snapshots = FEATURE_REGISTRY.map((spec) => {
    const row = metrics[spec.symbol] || {};
    const stale = typeof row?.as_of === 'string'
      ? (ageMinutes(row.as_of) ?? Number.MAX_SAFE_INTEGER) > spec.sla_minutes * 2
      : true;
    const fallback = Boolean(row?.quality_flags?.fallback || row?.source === 'mock');

    const qualityFactor = fallback ? 0.4 : stale ? 0.7 : 1;
    const effective_weight = Number((spec.weight_base * qualityFactor).toFixed(4));

    return {
      feature_id: spec.feature_id,
      symbol: spec.symbol,
      sleeve: spec.sleeve,
      label: spec.label,
      value: row?.value ?? null,
      as_of: row?.as_of ?? null,
      source: row?.source ?? 'unknown',
      stale,
      fallback,
      weight_base: spec.weight_base,
      effective_weight,
    };
  });

  return {
    data: {
      as_of: new Date().toISOString(),
      feature_count: snapshots.length,
      sleeves: Array.from(new Set(snapshots.map((s) => s.sleeve))),
      features: snapshots,
    },
    error: metricsResult.error,
  };
}

export async function buildSignalRegime() {
  const [overview, drift, featureSnapshot] = await Promise.all([
    fetchIntelligenceOverview(),
    assessDriftState(),
    buildSignalFeatures(),
  ]);

  const regime = overview.data.regime;
  const features = featureSnapshot.data.features;

  const sleeveStrength = {
    rates: features.filter((f) => f.sleeve === 'rates').reduce((a, b) => a + b.effective_weight, 0),
    fx: features.filter((f) => f.sleeve === 'fx').reduce((a, b) => a + b.effective_weight, 0),
    credit: features.filter((f) => f.sleeve === 'credit').reduce((a, b) => a + b.effective_weight, 0),
    volatility: features.filter((f) => f.sleeve === 'volatility').reduce((a, b) => a + b.effective_weight, 0),
    commodities: features.filter((f) => f.sleeve === 'commodities').reduce((a, b) => a + b.effective_weight, 0),
    macro: features.filter((f) => f.sleeve === 'macro').reduce((a, b) => a + b.effective_weight, 0),
  };

  const dimensions = {
    growth_impulse: regime.state === 'risk_on' ? 0.35 : regime.state === 'risk_off' ? -0.35 : 0,
    inflation_impulse: regime.drivers.some((d) => d.key.includes('fed') && d.impact === 'negative') ? 0.25 : 0,
    liquidity_conditions: regime.quality.quality_flags?.fallback ? -0.2 : 0.1,
    risk_appetite: regime.state === 'risk_on' ? 0.5 : regime.state === 'risk_off' ? -0.5 : 0,
  };

  const rawConfidence = regime.confidence;
  const cappedConfidence = drift.data.confidence_cap === 'low'
    ? 'low'
    : drift.data.confidence_cap === 'medium' && rawConfidence === 'high'
      ? 'medium'
      : rawConfidence;

  return {
    data: {
      as_of: new Date().toISOString(),
      regime: {
        label: regime.state,
        score: regime.score,
        confidence: cappedConfidence,
        confidence_raw: rawConfidence,
        confidence_capped_by_drift: drift.data.confidence_cap !== 'high',
        dimensions,
        sleeve_strength: sleeveStrength,
        feature_count: features.length,
        top_5_contributors: regime.drivers.slice(0, 5),
      },
      drift: drift.data,
    },
    error: overview.error || drift.error || featureSnapshot.error,
  };
}
