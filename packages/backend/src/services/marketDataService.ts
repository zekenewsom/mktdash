import { DataPoint, TimeSeriesPoint } from '../contracts/marketData';
import { getWithRetry } from '../lib/httpClient';

const FRED_API_KEY = process.env.FRED_API_KEY;
const FRED_BASE_URL = 'https://api.stlouisfed.org/fred/series/observations';
const PROVIDER_MODE = process.env.DATA_PROVIDER_MODE || 'live_with_fallback';
const PROVIDER_CACHE_TTL_MS = Number(process.env.PROVIDER_CACHE_TTL_MS || 5 * 60 * 1000);

const INDEX_SERIES = {
  SP500: 'SP500',
  NASDAQCOM: 'NASDAQCOM',
  DJIA: 'DJIA',
};

const STOOQ_SYMBOL: Record<string, string> = {
  SP500: '^spx',
  NASDAQCOM: '^ndq',
  DJIA: '^dji',
};

const INDEX_UNITS: Record<string, string> = {
  SP500: 'index',
  NASDAQCOM: 'index',
  DJIA: 'index',
};

const MOCK_DATA: Record<string, DataPoint> = {
  SP500: { symbol: 'SP500', source: 'mock', value: 5200.12, as_of: '2025-05-01', unit: 'index' },
  NASDAQCOM: { symbol: 'NASDAQCOM', source: 'mock', value: 16000.56, as_of: '2025-05-01', unit: 'index' },
  DJIA: { symbol: 'DJIA', source: 'mock', value: 35000.78, as_of: '2025-05-01', unit: 'index' },
};

type IndexKey = keyof typeof INDEX_SERIES;

const indexHistoryCache: Record<string, { data: TimeSeriesPoint[]; lastFetched: number }> = {};
const performanceCache: { data: Record<IndexKey, DataPoint & { change?: number; percentChange?: number }> | null; ts: number } = {
  data: null,
  ts: 0,
};
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export async function fetchIndexPerformance() {
  const now = Date.now();
  if (performanceCache.data && now - performanceCache.ts < PROVIDER_CACHE_TTL_MS) {
    return { data: performanceCache.data, error: null, cached: true };
  }

  try {
    const results: Record<IndexKey, DataPoint & { change?: number; percentChange?: number }> = {} as any;
    const useMockOnly = PROVIDER_MODE === 'mock_only';

    for (const key of Object.keys(INDEX_SERIES) as IndexKey[]) {
      if (useMockOnly) {
        results[key] = { ...MOCK_DATA[key], quality_flags: { fallback: true } } as any;
        continue;
      }

      const stooq = STOOQ_SYMBOL[key];

      try {
        const stooqUrl = `https://stooq.com/q/l/?s=${stooq}&i=d`;
        const stooqResp = await getWithRetry(stooqUrl, {
          timeout: 3500,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; mktdash/1.0; +https://mktdash.vercel.app)',
            Accept: 'text/csv,text/plain,*/*',
          },
        }, 0);
        const raw = String(stooqResp.data || '').trim();
        const parts = raw.split(',');
        if (parts.length >= 7) {
          const date = parts[1];
          const close = Number(parts[6]);
          const open = Number(parts[3]);
          const change = close - open;
          const percentChange = open ? (change / open) * 100 : 0;
          if (!Number.isNaN(close)) {
            results[key] = {
              symbol: key,
              source: 'stooq',
              value: close,
              as_of: date,
              unit: INDEX_UNITS[key],
              change,
              percentChange,
            };
            continue;
          }
        }
      } catch {
        // fallback below
      }

      const seriesId = INDEX_SERIES[key];
      const today = new Date().toISOString().slice(0, 10);
      const url = `${FRED_BASE_URL}?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&observation_end=${today}`;

      try {
        const resp = await getWithRetry(url);
        const obsArr = (resp.data as any).observations || [];
        const n = obsArr.length;

        if (n > 1) {
          const last = obsArr[n - 1];
          const prev = obsArr[n - 2];
          if (last.value !== '.' && prev.value !== '.') {
            const value = parseFloat(last.value);
            const prevValue = parseFloat(prev.value);
            const change = value - prevValue;
            const percentChange = (change / prevValue) * 100;
            results[key] = {
              symbol: key,
              source: 'fred',
              value,
              as_of: last.date,
              unit: INDEX_UNITS[key],
              change,
              percentChange,
            };
            continue;
          }
        }

        if (n > 0 && obsArr[n - 1].value !== '.') {
          const value = parseFloat(obsArr[n - 1].value);
          results[key] = {
            symbol: key,
            source: 'fred',
            value,
            as_of: obsArr[n - 1].date,
            unit: INDEX_UNITS[key],
            change: 0,
            percentChange: 0,
          };
        } else {
          results[key] = { ...MOCK_DATA[key], quality_flags: { fallback: true, missing: true } } as any;
        }
      } catch {
        results[key] = { ...MOCK_DATA[key], quality_flags: { fallback: true } } as any;
      }
    }

    performanceCache.data = results;
    performanceCache.ts = now;
    return { data: results, error: null, cached: false };
  } catch (err: any) {
    return { data: MOCK_DATA as any, error: err.message || 'API error, using mock data', cached: false };
  }
}

export async function fetchFredSeriesHistory(seriesId: string) {
  const now = Date.now();
  if (indexHistoryCache[seriesId] && now - indexHistoryCache[seriesId].lastFetched < CACHE_TTL_MS) {
    return { data: indexHistoryCache[seriesId].data, error: null, cached: true };
  }

  if (PROVIDER_MODE === 'mock_only') {
    return { data: [], error: null, cached: false };
  }

  // Prefer stooq for index history (more reliable than FRED for equity indices)
  if (STOOQ_SYMBOL[seriesId]) {
    try {
      const stooqUrl = `https://stooq.com/q/d/l/?s=${STOOQ_SYMBOL[seriesId]}&i=d`;
      const stooqResp = await getWithRetry(stooqUrl, {
        timeout: 6000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; mktdash/1.0; +https://mktdash.vercel.app)',
          Accept: 'text/csv,text/plain,*/*',
        },
      }, 0);
      const lines = String(stooqResp.data || '').trim().split('\n');
      const rows = lines.slice(1).filter(Boolean);
      const data: TimeSeriesPoint[] = rows.slice(-5000).map((line: string) => {
        const parts = line.split(',');
        return {
          symbol: seriesId,
          source: 'stooq' as const,
          as_of: parts[0],
          value: Number(parts[4]),
          unit: 'index',
        };
      }).filter((r) => !Number.isNaN(r.value));
      if (data.length > 0) {
        indexHistoryCache[seriesId] = { data, lastFetched: now };
        return { data, error: null, cached: false };
      }
    } catch {
      // continue to FRED fallback
    }
  }

  const url = `${FRED_BASE_URL}?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json`;
  try {
    const resp = await getWithRetry(url);
    const obsArr = (resp.data as any).observations || [];
    const data: TimeSeriesPoint[] = obsArr
      .filter((obs: any) => obs.value !== '.')
      .map((obs: any) => ({
        symbol: seriesId,
        source: 'fred',
        as_of: obs.date,
        value: parseFloat(obs.value),
        unit: 'index',
      }));

    indexHistoryCache[seriesId] = { data, lastFetched: now };
    return { data, error: null, cached: false };
  } catch (err: any) {
    const fallbackValue = (MOCK_DATA as any)[seriesId]?.value ?? 100;
    const days = 3650;
    const fallback: TimeSeriesPoint[] = Array.from({ length: days }).map((_, i) => ({
      symbol: seriesId,
      source: 'mock',
      as_of: new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      value: Number((fallbackValue * (0.85 + (i / days) * 0.3)).toFixed(2)),
      unit: 'index',
    }));
    indexHistoryCache[seriesId] = { data: fallback, lastFetched: now };
    return { data: fallback, error: err.message || 'API error', cached: false };
  }
}

export async function fetchIndexHistory(seriesId: string) {
  return fetchFredSeriesHistory(seriesId);
}

export function clearIndexHistoryCache() {
  Object.keys(indexHistoryCache).forEach((k) => delete indexHistoryCache[k]);
}
