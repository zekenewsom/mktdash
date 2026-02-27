import { fetchMacroData } from './fredService';
import { fetchIndexPerformance } from './marketDataService';
import { IntelligenceOverview, MaterialChange, RegimeDriver, RegimeState } from '../contracts/intelligence';

function toDirection(value: number | undefined): 'up' | 'down' | 'flat' {
  if (value == null) return 'flat';
  if (value > 0) return 'up';
  if (value < 0) return 'down';
  return 'flat';
}

function toConfidence(sources: string[], fallbackUsed: boolean, staleUsed: boolean): 'high' | 'medium' | 'low' {
  if (fallbackUsed || staleUsed) return 'low';
  if (sources.length >= 2) return 'high';
  return 'medium';
}

function ageDaysFromAsOf(asOf?: string | null): number | null {
  if (!asOf) return null;
  const ts = Date.parse(asOf);
  if (Number.isNaN(ts)) return null;
  return (Date.now() - ts) / (1000 * 60 * 60 * 24);
}

function withStaleFlag(dataPoint: any, maxAgeDays: number) {
  const ageDays = ageDaysFromAsOf(dataPoint?.as_of);
  const isStale = ageDays != null ? ageDays > maxAgeDays : false;
  return {
    ...dataPoint,
    quality_flags: {
      ...(dataPoint?.quality_flags || {}),
      ...(isStale ? { stale: true } : {}),
    },
  };
}

export async function fetchIntelligenceOverview() {
  const [indicesResult, macroResult] = await Promise.all([
    fetchIndexPerformance(),
    fetchMacroData(['FEDFUNDS', 'CPIAUCSL', 'UNRATE']),
  ]);

  const indicesRaw = indicesResult.data as any;
  const macroRaw = macroResult.data as any;

  const indices = {
    SP500: withStaleFlag(indicesRaw?.SP500, 3),
    NASDAQCOM: withStaleFlag(indicesRaw?.NASDAQCOM, 3),
    DJIA: withStaleFlag(indicesRaw?.DJIA, 3),
  };

  const macro = {
    FEDFUNDS: withStaleFlag(macroRaw?.FEDFUNDS, 45),
    CPIAUCSL: withStaleFlag(macroRaw?.CPIAUCSL, 60),
    UNRATE: withStaleFlag(macroRaw?.UNRATE, 45),
  };

  const spxChange = indices?.SP500?.percentChange ?? 0;
  const ndxChange = indices?.NASDAQCOM?.percentChange ?? 0;
  const dowChange = indices?.DJIA?.percentChange ?? 0;

  const avgEquityChange = (spxChange + ndxChange + dowChange) / 3;
  const unrate = macro?.UNRATE?.value;
  const fedFunds = macro?.FEDFUNDS?.value;

  let score = 50 + Math.max(-15, Math.min(15, avgEquityChange * 6));
  if (typeof unrate === 'number' && unrate > 4.5) score -= 8;
  if (typeof fedFunds === 'number' && fedFunds > 5) score -= 5;
  score = Math.max(0, Math.min(100, Math.round(score)));

  let state: RegimeState['state'] = 'neutral';
  if (score >= 60) state = 'risk_on';
  if (score <= 40) state = 'risk_off';

  const drivers: RegimeDriver[] = [
    {
      key: 'spx',
      label: 'S&P 500 daily change',
      direction: toDirection(spxChange),
      impact: spxChange > 0 ? 'positive' : spxChange < 0 ? 'negative' : 'neutral',
    },
    {
      key: 'fedfunds',
      label: 'Fed Funds level',
      direction: 'flat',
      impact: typeof fedFunds === 'number' && fedFunds > 5 ? 'negative' : 'neutral',
    },
    {
      key: 'unrate',
      label: 'Unemployment rate',
      direction: 'flat',
      impact: typeof unrate === 'number' && unrate <= 4.2 ? 'positive' : 'neutral',
    },
  ];

  const mergedPoints = [indices?.SP500, indices?.NASDAQCOM, indices?.DJIA, macro?.FEDFUNDS, macro?.CPIAUCSL, macro?.UNRATE];

  const fallbackUsed = mergedPoints.some((d: any) => Boolean(d?.quality_flags?.fallback || d?.source === 'mock'));
  const staleUsed = mergedPoints.some((d: any) => Boolean(d?.quality_flags?.stale));

  const sources = Array.from(
    new Set(
      [indices?.SP500?.source, indices?.NASDAQCOM?.source, indices?.DJIA?.source, macro?.FEDFUNDS?.source, macro?.CPIAUCSL?.source, macro?.UNRATE?.source]
        .filter(Boolean),
    ),
  ) as string[];

  const confidence = toConfidence(sources, fallbackUsed, staleUsed);
  const asOf = new Date().toISOString();

  const regime: RegimeState = {
    state,
    score,
    confidence,
    drivers,
    quality: {
      as_of: asOf,
      source: sources.join('+') || 'unknown',
      confidence,
      quality_flags: {
        ...(fallbackUsed ? { fallback: true } : {}),
        ...(staleUsed ? { stale: true } : {}),
      },
    },
  };

  const changes: MaterialChange[] = [
    {
      id: 'spx-daily',
      title: 'S&P 500 daily move',
      detail: `S&P 500 moved ${spxChange >= 0 ? '+' : ''}${spxChange.toFixed(2)}% vs prior close.`,
      category: 'risk',
      direction: spxChange > 0 ? 'bullish' : spxChange < 0 ? 'bearish' : 'neutral',
      magnitude: Math.abs(spxChange),
      as_of: asOf,
      confidence,
      source: indices?.SP500?.source || 'unknown',
      quality_flags: indices?.SP500?.quality_flags,
    },
    {
      id: 'fedfunds-level',
      title: 'Policy stance level',
      detail: `Fed Funds currently at ${typeof fedFunds === 'number' ? fedFunds.toFixed(2) : 'N/A'}%.`,
      category: 'policy',
      direction: typeof fedFunds === 'number' && fedFunds > 5 ? 'bearish' : 'neutral',
      as_of: asOf,
      confidence,
      source: macro?.FEDFUNDS?.source || 'unknown',
      quality_flags: macro?.FEDFUNDS?.quality_flags,
    },
    {
      id: 'unrate-level',
      title: 'Labor market pulse',
      detail: `Unemployment rate latest print: ${typeof unrate === 'number' ? unrate.toFixed(2) : 'N/A'}%.`,
      category: 'growth',
      direction: typeof unrate === 'number' && unrate <= 4.2 ? 'bullish' : 'neutral',
      as_of: asOf,
      confidence,
      source: macro?.UNRATE?.source || 'unknown',
      quality_flags: macro?.UNRATE?.quality_flags,
    },
  ];

  const overview: IntelligenceOverview = {
    regime,
    changes,
    quality: {
      as_of: asOf,
      confidence,
      fallback_used: fallbackUsed,
      stale_used: staleUsed,
      stale_count: mergedPoints.filter((d: any) => Boolean(d?.quality_flags?.stale)).length,
      sources,
    },
  };

  const errors = [indicesResult.error, macroResult.error].filter(Boolean);
  return {
    data: overview,
    error: errors.length > 0 ? errors.join(' | ') : null,
  };
}
