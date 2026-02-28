import { fetchIntelligenceMetrics } from './signalSources';
import { fetchIntelligenceOverview } from './intelligenceService';
import { assessDriftState } from './driftService';

export async function buildSignalFeatures() {
  const metricsResult = await fetchIntelligenceMetrics();
  const metrics = metricsResult.data || {};

  const features = [
    { feature_id: 'UST10Y', sleeve: 'rates', value: metrics.DGS10?.value ?? null, as_of: metrics.DGS10?.as_of ?? null, source: metrics.DGS10?.source ?? 'unknown' },
    { feature_id: 'UST2Y', sleeve: 'rates', value: metrics.DGS2?.value ?? null, as_of: metrics.DGS2?.as_of ?? null, source: metrics.DGS2?.source ?? 'unknown' },
    { feature_id: 'CURVE_2S10S', sleeve: 'rates', value: metrics.T10Y2Y?.value ?? null, as_of: metrics.T10Y2Y?.as_of ?? null, source: metrics.T10Y2Y?.source ?? 'unknown' },
    { feature_id: 'DXY', sleeve: 'fx', value: metrics.DTWEXBGS?.value ?? null, as_of: metrics.DTWEXBGS?.as_of ?? null, source: metrics.DTWEXBGS?.source ?? 'unknown' },
    { feature_id: 'EURUSD', sleeve: 'fx', value: metrics.DEXUSEU?.value ?? null, as_of: metrics.DEXUSEU?.as_of ?? null, source: metrics.DEXUSEU?.source ?? 'unknown' },
    { feature_id: 'WTI', sleeve: 'commodities', value: metrics.DCOILWTICO?.value ?? null, as_of: metrics.DCOILWTICO?.as_of ?? null, source: metrics.DCOILWTICO?.source ?? 'unknown' },
    { feature_id: 'GOLD', sleeve: 'commodities', value: metrics.GOLDAMGBD228NLBM?.value ?? null, as_of: metrics.GOLDAMGBD228NLBM?.as_of ?? null, source: metrics.GOLDAMGBD228NLBM?.source ?? 'unknown' },
    { feature_id: 'VIX', sleeve: 'volatility', value: metrics.VIXCLS?.value ?? null, as_of: metrics.VIXCLS?.as_of ?? null, source: metrics.VIXCLS?.source ?? 'unknown' },
    { feature_id: 'HY_OAS', sleeve: 'credit', value: metrics.BAMLH0A0HYM2?.value ?? null, as_of: metrics.BAMLH0A0HYM2?.as_of ?? null, source: metrics.BAMLH0A0HYM2?.source ?? 'unknown' },
    { feature_id: 'FEDFUNDS', sleeve: 'macro', value: metrics.FEDFUNDS?.value ?? null, as_of: metrics.FEDFUNDS?.as_of ?? null, source: metrics.FEDFUNDS?.source ?? 'unknown' },
    { feature_id: 'CPI', sleeve: 'macro', value: metrics.CPIAUCSL?.value ?? null, as_of: metrics.CPIAUCSL?.as_of ?? null, source: metrics.CPIAUCSL?.source ?? 'unknown' },
    { feature_id: 'UNRATE', sleeve: 'macro', value: metrics.UNRATE?.value ?? null, as_of: metrics.UNRATE?.as_of ?? null, source: metrics.UNRATE?.source ?? 'unknown' },
  ];

  return {
    data: {
      as_of: new Date().toISOString(),
      feature_count: features.length,
      features,
    },
    error: metricsResult.error,
  };
}

export async function buildSignalRegime() {
  const [overview, drift] = await Promise.all([fetchIntelligenceOverview(), assessDriftState()]);
  const regime = overview.data.regime;

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
        top_5_contributors: regime.drivers.slice(0, 5),
      },
      drift: drift.data,
    },
    error: overview.error || drift.error,
  };
}
