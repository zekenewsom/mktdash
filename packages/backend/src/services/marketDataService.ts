import axios from 'axios';
import { DataPoint, TimeSeriesPoint } from '../contracts/marketData';

const FRED_API_KEY = process.env.FRED_API_KEY;
const FRED_BASE_URL = 'https://api.stlouisfed.org/fred/series/observations';
const HTTP_TIMEOUT_MS = Number(process.env.HTTP_TIMEOUT_MS || 8000);
const PROVIDER_MODE = process.env.DATA_PROVIDER_MODE || 'live_with_fallback';

const INDEX_SERIES = {
  SP500: 'SP500',
  NASDAQCOM: 'NASDAQCOM',
  DJIA: 'DJIA',
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
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export async function fetchIndexPerformance() {
  try {
    const results: Record<IndexKey, DataPoint & { change?: number; percentChange?: number }> = {} as any;
    const useMockOnly = PROVIDER_MODE === 'mock_only' || !FRED_API_KEY;

    for (const key of Object.keys(INDEX_SERIES) as IndexKey[]) {
      if (useMockOnly) {
        results[key] = { ...MOCK_DATA[key], quality_flags: { fallback: true } } as any;
        continue;
      }

      const seriesId = INDEX_SERIES[key];
      const today = new Date().toISOString().slice(0, 10);
      const url = `${FRED_BASE_URL}?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&observation_end=${today}`;

      try {
        const resp = await axios.get(url, { timeout: HTTP_TIMEOUT_MS });
        const obsArr = resp.data.observations || [];
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

    return { data: results, error: null };
  } catch (err: any) {
    return { data: MOCK_DATA, error: err.message || 'API error, using mock data' };
  }
}

export async function fetchFredSeriesHistory(seriesId: string) {
  const now = Date.now();
  if (indexHistoryCache[seriesId] && now - indexHistoryCache[seriesId].lastFetched < CACHE_TTL_MS) {
    return { data: indexHistoryCache[seriesId].data, error: null, cached: true };
  }

  if (PROVIDER_MODE === 'mock_only' || !FRED_API_KEY) {
    return { data: [], error: null, cached: false };
  }

  const url = `${FRED_BASE_URL}?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json`;
  try {
    const resp = await axios.get(url, { timeout: HTTP_TIMEOUT_MS });
    const obsArr = resp.data.observations || [];
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
    return { data: [], error: err.message || 'API error', cached: false };
  }
}

export async function fetchIndexHistory(seriesId: string) {
  return fetchFredSeriesHistory(seriesId);
}

export function clearIndexHistoryCache() {
  Object.keys(indexHistoryCache).forEach((k) => delete indexHistoryCache[k]);
}
