import { DataPoint } from '../contracts/marketData';
import { getWithRetry } from '../lib/httpClient';

const FRED_API_KEY = process.env.FRED_API_KEY;
const FRED_BASE_URL = 'https://api.stlouisfed.org/fred/series/observations';
const PROVIDER_MODE = process.env.DATA_PROVIDER_MODE || 'live_with_fallback';
const PROVIDER_CACHE_TTL_MS = Number(process.env.PROVIDER_CACHE_TTL_MS || 5 * 60 * 1000);

const MOCK_DATA: Record<string, DataPoint> = {
  FEDFUNDS: { symbol: 'FEDFUNDS', source: 'mock', value: 5.33, as_of: '2025-05-01', unit: '%' },
  CPIAUCSL: { symbol: 'CPIAUCSL', source: 'mock', value: 312.332, as_of: '2025-04-01', unit: 'index' },
  UNRATE: { symbol: 'UNRATE', source: 'mock', value: 3.8, as_of: '2025-04-01', unit: '%' },
};

const macroCache: Record<string, { data: Record<string, DataPoint>; ts: number }> = {};

export async function fetchMacroData(seriesIds: string[]) {
  const useMockOnly = PROVIDER_MODE === 'mock_only' || !FRED_API_KEY;
  const cacheKey = [...seriesIds].sort().join(',');
  const now = Date.now();

  if (macroCache[cacheKey] && now - macroCache[cacheKey].ts < PROVIDER_CACHE_TTL_MS) {
    return { data: macroCache[cacheKey].data, error: null, cached: true };
  }

  try {
    const results: Record<string, DataPoint> = {};

    for (const id of seriesIds) {
      if (useMockOnly) {
        results[id] = MOCK_DATA[id] ?? {
          symbol: id,
          source: 'mock',
          value: null,
          as_of: null,
          unit: 'unknown',
          quality_flags: { missing: true, fallback: true },
        };
        continue;
      }

      const today = new Date().toISOString().slice(0, 10);
      const url = `${FRED_BASE_URL}?series_id=${id}&api_key=${FRED_API_KEY}&file_type=json&observation_end=${today}`;

      try {
        const resp = await getWithRetry(url);
        const obsArr = (resp.data as any).observations || [];
        const obs = obsArr.length > 0 ? obsArr[obsArr.length - 1] : undefined;

        if (obs && obs.value !== '.') {
          results[id] = {
            symbol: id,
            source: 'fred',
            value: parseFloat(obs.value),
            as_of: obs.date,
            unit: id === 'CPIAUCSL' ? 'index' : '%',
          };
        } else {
          results[id] = {
            symbol: id,
            source: 'fred',
            value: null,
            as_of: obs?.date || null,
            unit: id === 'CPIAUCSL' ? 'index' : '%',
            quality_flags: { missing: true },
          };
        }
      } catch {
        results[id] = {
          ...(MOCK_DATA[id] ?? {
            symbol: id,
            source: 'mock',
            value: null,
            as_of: null,
            unit: 'unknown',
          }),
          quality_flags: { fallback: true },
        };
      }
    }

    macroCache[cacheKey] = { data: results, ts: now };
    return { data: results, error: null, cached: false };
  } catch (err: any) {
    return { data: MOCK_DATA, error: err.message || 'API error, using mock data', cached: false };
  }
}
