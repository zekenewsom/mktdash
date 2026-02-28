import { Request, Response } from 'express';
import { fetchMacroData } from '../services/fredService';
import { fetchIndexPerformance, fetchIndexHistory, fetchFredSeriesHistory } from '../services/marketDataService';
import { fetchEconomicCalendar } from '../services/calendarService';
import { sendError, sendSuccess } from '../lib/apiResponse';
import { validateDataQualityPayload } from '../lib/validators';
import { getRequestMetricsSnapshot } from '../lib/requestMetrics';

export const getMacroData = async (_req: Request, res: Response) => {
  const seriesIds = ['FEDFUNDS', 'CPIAUCSL', 'UNRATE'];

  try {
    const result = await fetchMacroData(seriesIds);
    if (result.error) {
      return sendError(res, 'UPSTREAM_FRED_ERROR', result.error, 500, undefined, result.data);
    }
    return sendSuccess(res, result.data);
  } catch (err: any) {
    return sendError(res, 'INTERNAL_ERROR', err.message || 'Unknown error', 500);
  }
};

export const getIndexHistory = async (req: Request, res: Response) => {
  const { index } = req.query;
  if (!index || typeof index !== 'string') {
    return sendError(res, 'VALIDATION_ERROR', 'Missing or invalid index query param', 400);
  }

  try {
    const result = await fetchIndexHistory(index);
    if (result.error) {
      return sendError(res, 'UPSTREAM_FRED_ERROR', result.error, 500, { index }, result.data);
    }
    return sendSuccess(res, result.data);
  } catch (err: any) {
    return sendError(res, 'INTERNAL_ERROR', err.message || 'Unknown error', 500);
  }
};

export const getSeriesHistory = async (req: Request, res: Response) => {
  const { series } = req.query;
  if (!series || typeof series !== 'string') {
    return sendError(res, 'VALIDATION_ERROR', 'Missing or invalid series query param', 400);
  }

  try {
    const result = await fetchFredSeriesHistory(series);
    if (result.error) {
      return sendError(res, 'UPSTREAM_FRED_ERROR', result.error, 500, { series }, result.data);
    }
    return sendSuccess(res, result.data);
  } catch (err: any) {
    return sendError(res, 'INTERNAL_ERROR', err.message || 'Unknown error', 500);
  }
};

export const getMarketIndices = async (_req: Request, res: Response) => {
  try {
    const result = await fetchIndexPerformance();
    if (result.error) {
      return sendError(res, 'UPSTREAM_FRED_ERROR', result.error, 500, undefined, result.data);
    }
    return sendSuccess(res, result.data);
  } catch (err: any) {
    return sendError(res, 'INTERNAL_ERROR', err.message || 'Unknown error', 500);
  }
};

function ageMinutes(asOf?: string | null) {
  if (!asOf) return null;
  const ts = Date.parse(asOf);
  if (Number.isNaN(ts)) return null;
  return Math.round((Date.now() - ts) / (1000 * 60));
}

function isStale(symbol: string, ageMins: number | null) {
  if (ageMins == null) return false;
  const thresholdBySymbol: Record<string, number> = {
    SP500: 60 * 24 * 3,
    NASDAQCOM: 60 * 24 * 3,
    DJIA: 60 * 24 * 3,
    FEDFUNDS: 60 * 24 * 45,
    CPIAUCSL: 60 * 24 * 60,
    UNRATE: 60 * 24 * 45,
  };
  const threshold = thresholdBySymbol[symbol] ?? 60 * 24 * 7;
  return ageMins > threshold;
}

export const getBackendStatus = async (_req: Request, res: Response) => {
  try {
    return sendSuccess(res, {
      status: 'ok',
      uptime_seconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return sendError(res, 'INTERNAL_ERROR', err.message || 'Unknown error', 500);
  }
};

export const getRequestMetrics = async (_req: Request, res: Response) => {
  try {
    return sendSuccess(res, {
      generated_at: new Date().toISOString(),
      metrics: getRequestMetricsSnapshot(),
    });
  } catch (err: any) {
    return sendError(res, 'INTERNAL_ERROR', err.message || 'Unknown error', 500);
  }
};

export const getDataQuality = async (_req: Request, res: Response) => {
  try {
    const [indicesResult, macroResult, calendarResult] = await Promise.all([
      fetchIndexPerformance(),
      fetchMacroData(['FEDFUNDS', 'CPIAUCSL', 'UNRATE', 'DGS10', 'DGS2', 'T10Y2Y', 'VIXCLS', 'DTWEXBGS', 'DCOILWTICO', 'GOLDAMGBD228NLBM']),
      fetchEconomicCalendar(),
    ]);

    const indexPoints = Object.values(indicesResult.data || {}) as any[];
    const macroPoints = Object.values(macroResult.data || {}) as any[];
    const points = [...indexPoints, ...macroPoints];

    const records = points.map((p: any) => {
      const age_mins = ageMinutes(p?.as_of);
      const stale = Boolean(p?.quality_flags?.stale) || isStale(p?.symbol, age_mins);
      const fallback = Boolean(p?.quality_flags?.fallback || p?.source === 'mock');
      return {
        symbol: p?.symbol || 'unknown',
        source: p?.source || 'unknown',
        as_of: p?.as_of || null,
        age_mins,
        stale,
        fallback,
        quality_flags: p?.quality_flags || {},
      };
    });

    const stale_count = records.filter((r) => r.stale).length;
    const fallback_count = records.filter((r) => r.fallback).length;

    const completeness_count = points.filter((p: any) => p?.value != null && p?.as_of != null).length;
    const completeness_ratio = points.length ? completeness_count / points.length : 0;
    const freshness_ratio = records.length ? (records.length - stale_count) / records.length : 0;

    const indexDriftFlags = indexPoints
      .map((p: any) => ({
        symbol: p?.symbol,
        percent_change: p?.percentChange,
        drift: typeof p?.percentChange === 'number' ? Math.abs(p.percentChange) >= 1.5 : false,
      }))
      .filter((d) => d.symbol);

    const calendarEvents = (calendarResult.data || []) as any[];
    const nowIso = new Date().toISOString();
    const calendarUpcoming = calendarEvents.filter((e) => typeof e?.scheduled_at === 'string' && e.scheduled_at >= nowIso).length;

    const payload = {
      generated_at: new Date().toISOString(),
      totals: {
        metrics: records.length,
        stale_count,
        fallback_count,
      },
      records,
      dataset_metrics: {
        freshness_ratio,
        completeness_ratio,
        drift: {
          index_drift_count: indexDriftFlags.filter((d) => d.drift).length,
          index_drift_flags: indexDriftFlags,
        },
        calendar: {
          event_count: calendarEvents.length,
          upcoming_count: calendarUpcoming,
          source_fallback_used: calendarEvents.some((e) => String(e?.source || '').includes('scaffold')),
        },
      },
      provider_errors: [indicesResult.error, macroResult.error, calendarResult.error].filter(Boolean),
    };

    if (!validateDataQualityPayload(payload)) {
      return sendError(res, 'VALIDATION_ERROR', 'Data quality payload failed contract validation', 500, undefined, payload);
    }

    return sendSuccess(res, payload);
  } catch (err: any) {
    return sendError(res, 'INTERNAL_ERROR', err.message || 'Unknown error', 500);
  }
};
