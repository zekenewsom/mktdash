import { DataPoint } from '../contracts/marketData';
import { getWithRetry } from '../lib/httpClient';

const FRED_API_KEY = process.env.FRED_API_KEY;
const FRED_BASE_URL = 'https://api.stlouisfed.org/fred/series/observations';
const PROVIDER_MODE = process.env.DATA_PROVIDER_MODE || 'mock_only';
const PROVIDER_CACHE_TTL_MS = Number(process.env.PROVIDER_CACHE_TTL_MS || 5 * 60 * 1000);

// Comprehensive mock data for all 30+ metrics
const MOCK_DATA: Record<string, DataPoint> = {
  // Rates
  DGS2: { symbol: 'DGS2', source: 'mock', value: 4.25, as_of: '2026-02-28', unit: '%' },
  DGS5: { symbol: 'DGS5', source: 'mock', value: 4.12, as_of: '2026-02-28', unit: '%' },
  DGS10: { symbol: 'DGS10', source: 'mock', value: 4.38, as_of: '2026-02-28', unit: '%' },
  DGS30: { symbol: 'DGS30', source: 'mock', value: 4.52, as_of: '2026-02-28', unit: '%' },
  T10Y2Y: { symbol: 'T10Y2Y', source: 'mock', value: 0.13, as_of: '2026-02-28', unit: '%' },
  T5YIE: { symbol: 'T5YIE', source: 'mock', value: 2.45, as_of: '2026-02-28', unit: '%' },
  DFII10: { symbol: 'DFII10', source: 'mock', value: 2.18, as_of: '2026-02-28', unit: '%' },

  // FX
  DTWEXBGS: { symbol: 'DTWEXBGS', source: 'mock', value: 107.42, as_of: '2026-02-28', unit: 'index' },
  DEXUSEU: { symbol: 'DEXUSEU', source: 'mock', value: 1.0842, as_of: '2026-02-28', unit: 'ratio' },
  DEXJPUS: { symbol: 'DEXJPUS', source: 'mock', value: 149.85, as_of: '2026-02-28', unit: 'ratio' },
  DEXUSUK: { symbol: 'DEXUSUK', source: 'mock', value: 1.2654, as_of: '2026-02-28', unit: 'ratio' },

  // Credit / Vol
  VIXCLS: { symbol: 'VIXCLS', source: 'mock', value: 18.42, as_of: '2026-02-28', unit: 'index' },
  BAMLH0A0HYM2: { symbol: 'BAMLH0A0HYM2', source: 'mock', value: 4.82, as_of: '2026-02-28', unit: '%' },
  BAMLC0A0CM: { symbol: 'BAMLC0A0CM', source: 'mock', value: 1.24, as_of: '2026-02-28', unit: '%' },

  // Commodities
  DCOILWTICO: { symbol: 'DCOILWTICO', source: 'mock', value: 67.85, as_of: '2026-02-28', unit: '$/bbl' },
  DCOILBRENTEU: { symbol: 'DCOILBRENTEU', source: 'mock', value: 71.23, as_of: '2026-02-28', unit: '$/bbl' },
  GOLDAMGBD228NLBM: { symbol: 'GOLDAMGBD228NLBM', source: 'mock', value: 2045.60, as_of: '2026-02-28', unit: '$/oz' },
  PCOPPUSDM: { symbol: 'PCOPPUSDM', source: 'mock', value: 3.82, as_of: '2026-02-28', unit: '$/lb' },

  // Macro / Policy
  FEDFUNDS: { symbol: 'FEDFUNDS', source: 'mock', value: 5.33, as_of: '2026-02-28', unit: '%' },
  DFF: { symbol: 'DFF', source: 'mock', value: 5.33, as_of: '2026-02-28', unit: '%' },
  SOFR: { symbol: 'SOFR', source: 'mock', value: 5.31, as_of: '2026-02-28', unit: '%' },
  CPIAUCSL: { symbol: 'CPIAUCSL', source: 'mock', value: 315.45, as_of: '2026-02-28', unit: 'index' },
  CPILFESL: { symbol: 'CPILFESL', source: 'mock', value: 318.12, as_of: '2026-02-28', unit: 'index' },
  PCEPI: { symbol: 'PCEPI', source: 'mock', value: 156.88, as_of: '2026-02-28', unit: 'index' },
  PCEPILFE: { symbol: 'PCEPILFE', source: 'mock', value: 159.24, as_of: '2026-02-28', unit: 'index' },
  UNRATE: { symbol: 'UNRATE', source: 'mock', value: 3.9, as_of: '2026-02-28', unit: '%' },
  PAYEMS: { symbol: 'PAYEMS', source: 'mock', value: 156.82, as_of: '2026-02-28', unit: 'millions' },
  ICSA: { symbol: 'ICSA', source: 'mock', value: 215.0, as_of: '2026-02-28', unit: 'thousands' },
  INDPRO: { symbol: 'INDPRO', source: 'mock', value: 104.8, as_of: '2026-02-28', unit: 'index' },
  RSAFS: { symbol: 'RSAFS', source: 'mock', value: 145.2, as_of: '2026-02-28', unit: 'index' },
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
