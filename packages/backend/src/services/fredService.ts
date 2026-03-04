import { DataPoint } from '../contracts/marketData';
import { getWithRetry } from '../lib/httpClient';

const FRED_API_KEY = process.env.FRED_API_KEY;
const FRED_BASE_URL = 'https://api.stlouisfed.org/fred/series/observations';
const PROVIDER_MODE = process.env.DATA_PROVIDER_MODE || 'fred';
const PROVIDER_CACHE_TTL_MS = Number(process.env.PROVIDER_CACHE_TTL_MS || 5 * 60 * 1000);

// Comprehensive mock data for all 60+ metrics (including Daily Shot series)
const MOCK_DATA: Record<string, DataPoint> = {
  // ===== EXISTING METRICS =====
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
  DEXCHUS: { symbol: 'DEXCHUS', source: 'mock', value: 1.35, as_of: '2026-02-28', unit: 'ratio' },

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
  CCSA: { symbol: 'CCSA', source: 'mock', value: 1850.0, as_of: '2026-02-28', unit: 'thousands' },
  INDPRO: { symbol: 'INDPRO', source: 'mock', value: 104.8, as_of: '2026-02-28', unit: 'index' },
  RSAFS: { symbol: 'RSAFS', source: 'mock', value: 145.2, as_of: '2026-02-28', unit: 'index' },

  // ===== DAILY SHOT SERIES (Phase 1) =====
  // USA - Claims & Orders
  DGORDER: { symbol: 'DGORDER', source: 'mock', value: -0.2, as_of: '2026-02-01', unit: '%' },
  MUEMPGS: { symbol: 'MUEMPGS', source: 'mock', value: -0.5, as_of: '2026-01-01', unit: '%' },
  CHPMN: { symbol: 'CHPMN', source: 'mock', value: 45.2, as_of: '2026-02-28', unit: 'index' },
  UMCSENT: { symbol: 'UMCSENT', source: 'mock', value: 65.5, as_of: '2026-02-28', unit: 'index' },
  MORTGAGE30US: { symbol: 'MORTGAGE30US', source: 'mock', value: 6.85, as_of: '2026-02-28', unit: '%' },

  // Canada
  CANRGDP: { symbol: 'CANRGDP', source: 'mock', value: 2.1, as_of: '2025-12-01', unit: '%' },

  // UK
  GBRGDP: { symbol: 'GBRGDP', source: 'mock', value: 1.2, as_of: '2025-12-01', unit: '%' },

  // Eurozone - HICP (Inflation)
  CP0400G: { symbol: 'CP0400G', source: 'mock', value: 2.4, as_of: '2026-02-28', unit: '%' },
  CP0500G: { symbol: 'CP0500G', source: 'mock', value: 1.8, as_of: '2026-02-28', unit: '%' },
  CP0700G: { symbol: 'CP0700G', source: 'mock', value: 1.5, as_of: '2026-02-28', unit: '%' },
  CP0800G: { symbol: 'CP0800G', source: 'mock', value: 2.8, as_of: '2026-02-28', unit: '%' },
  LRHUTTTTGEM156S: { symbol: 'LRHUTTTTGEM156S', source: 'mock', value: 6.2, as_of: '2026-01-01', unit: '%' },

  // Japan
  IPG2211N: { symbol: 'IPG2211N', source: 'mock', value: -2.5, as_of: '2026-01-01', unit: '%' },
  LRUNTTTTJPM156S: { symbol: 'LRUNTTTTJPM156S', source: 'mock', value: 2.8, as_of: '2026-01-01', unit: '%' },
  IRLTLT01JPM156N: { symbol: 'IRLTLT01JPM156N', source: 'mock', value: 1.45, as_of: '2026-02-28', unit: '%' },

  // Additional EM/Asia FX
  DEXCHNA: { symbol: 'DEXCHNA', source: 'mock', value: 7.25, as_of: '2026-02-28', unit: 'ratio' },
  DEXKUS: { symbol: 'DEXKUS', source: 'mock', value: 1320.0, as_of: '2026-02-28', unit: 'ratio' },
  DEXINUS: { symbol: 'DEXINUS', source: 'mock', value: 83.5, as_of: '2026-02-28', unit: 'ratio' },
  DEXMXUS: { symbol: 'DEXMXUS', source: 'mock', value: 0.058, as_of: '2026-02-28', unit: 'ratio' },
  DEXTAUS: { symbol: 'DEXTAUS', source: 'mock', value: 0.62, as_of: '2026-02-28', unit: 'ratio' },
  DEXSZUS: { symbol: 'DEXSZUS', source: 'mock', value: 0.136, as_of: '2026-02-28', unit: 'ratio' },
  DEXBAUS: { symbol: 'DEXBAUS', source: 'mock', value: 0.26, as_of: '2026-02-28', unit: 'ratio' },
  DEXHKUS: { symbol: 'DEXHKUS', source: 'mock', value: 0.128, as_of: '2026-02-28', unit: 'ratio' },

  // Additional macro
  AWHMAN: { symbol: 'AWHMAN', source: 'mock', value: 33.5, as_of: '2026-02-28', unit: 'hours' },
  NAPM: { symbol: 'NAPM', source: 'mock', value: 48.5, as_of: '2026-02-28', unit: 'index' },
  NAPMI: { symbol: 'NAPMI', source: 'mock', value: 52.1, as_of: '2026-02-28', unit: 'index' },
  HOUST: { symbol: 'HOUST', source: 'mock', value: 1.35, as_of: '2026-01-01', unit: 'millions' },
  PERMIT: { symbol: 'PERMIT', source: 'mock', value: 1.42, as_of: '2026-01-01', unit: 'millions' },
  MORTGAGE15US: { symbol: 'MORTGAGE15US', source: 'mock', value: 6.15, as_of: '2026-02-28', unit: '%' },
  'SP500': { symbol: 'SP500', source: 'mock', value: 4950.0, as_of: '2026-02-28', unit: 'index' },
  'DOW': { symbol: 'DOW', source: 'mock', value: 38500.0, as_of: '2026-02-28', unit: 'index' },
};

const macroCache: Record<string, { data: Record<string, DataPoint>; ts: number }> = {};

// Unit detection for FRED series
function getUnitForSeries(seriesId: string): string {
  const units: Record<string, string> = {
    // Indexes
    CPIAUCSL: 'index', CPILFESL: 'index', PCEPI: 'index', PCEPILFE: 'index',
    INDPRO: 'index', PAYEMS: 'millions', RSAFS: 'index',
    CHPMN: 'index', UMCSENT: 'index', NAPM: 'index', NAPMI: 'index',
    
    // Employment
    ICSA: 'thousands', CCSA: 'thousands', UNRATE: '%',
    LRHUTTTTGEM156S: '%', LRUNTTTTJPM156S: '%',
    AWHMAN: 'hours', HOUST: 'millions', PERMIT: 'millions',
    
    // Orders & Production
    DGORDER: '%', MUEMPGS: '%', IPG2211N: '%',
    
    // Rates
    DGS2: '%', DGS5: '%', DGS10: '%', DGS30: '%',
    T10Y2Y: '%', T5YIE: '%', DFII10: '%',
    FEDFUNDS: '%', DFF: '%', SOFR: '%',
    MORTGAGE30US: '%', MORTGAGE15US: '%',
    IRLTLT01JPM156N: '%',
    
    // FX (ratio or index)
    DTWEXBGS: 'index', DEXUSEU: 'ratio', DEXJPUS: 'ratio',
    DEXUSUK: 'ratio', DEXCHUS: 'ratio', DEXCHNA: 'ratio',
    DEXKUS: 'ratio', DEXINUS: 'ratio', DEXMXUS: 'ratio',
    DEXTAUS: 'ratio', DEXSZUS: 'ratio', DEXBAUS: 'ratio',
    DEXHKUS: 'ratio',
    
    // Credit/Vol
    VIXCLS: 'index', BAMLH0A0HYM2: '%', BAMLC0A0CM: '%',
    
    // Commodities
    DCOILWTICO: '$/bbl', DCOILBRENTEU: '$/bbl',
    GOLDAMGBD228NLBM: '$/oz', PCOPPUSDM: '$/lb',
    
    // GDP
    CANRGDP: '%', GBRGDP: '%',
    
    // Inflation (HICP)
    CP0400G: '%', CP0500G: '%', CP0700G: '%', CP0800G: '%',
  };
  return units[seriesId] || 'unknown';
}

export async function fetchMacroData(seriesIds: string[]) {
  const useMockOnly = PROVIDER_MODE === 'mock_only' || !FRED_API_KEY;
  const cacheKey = [...seriesIds].sort().join(',');
  const now = Date.now();

  if (macroCache[cacheKey] && now - macroCache[cacheKey].ts < PROVIDER_CACHE_TTL_MS) {
    return { data: macroCache[cacheKey].data, error: null, cached: true };
  }

  try {
    const results: Record<string, DataPoint> = {};

    // Fast path: use mock data if configured
    if (useMockOnly) {
      for (const id of seriesIds) {
        results[id] = MOCK_DATA[id] ?? {
          symbol: id,
          source: 'mock',
          value: null,
          as_of: null,
          unit: 'unknown',
          quality_flags: { missing: true, fallback: true },
        };
      }
      macroCache[cacheKey] = { data: results, ts: now };
      return { data: results, error: null, cached: false };
    }

    // Parallel fetch with batching (5 at a time to avoid rate limits)
    const BATCH_SIZE = 5;
    const today = new Date().toISOString().slice(0, 10);
    
    const fetchSeries = async (id: string): Promise<[string, DataPoint]> => {
      const url = `${FRED_BASE_URL}?series_id=${id}&api_key=${FRED_API_KEY}&file_type=json&observation_end=${today}`;
      
      try {
        const resp = await getWithRetry(url);
        const obsArr = (resp.data as any).observations || [];
        const obs = obsArr.length > 0 ? obsArr[obsArr.length - 1] : undefined;

        if (obs && obs.value !== '.') {
          return [id, {
            symbol: id,
            source: 'fred',
            value: parseFloat(obs.value),
            as_of: obs.date,
            unit: getUnitForSeries(id),
          }];
        } else {
          return [id, {
            symbol: id,
            source: 'fred',
            value: null,
            as_of: obs?.date || null,
            unit: getUnitForSeries(id),
            quality_flags: { missing: true },
          }];
        }
      } catch {
        return [id, {
          ...(MOCK_DATA[id] ?? {
            symbol: id,
            source: 'mock',
            value: null,
            as_of: null,
            unit: getUnitForSeries(id),
          }),
          quality_flags: { fallback: true },
        }];
      }
    };

    // Process in batches
    for (let i = 0; i < seriesIds.length; i += BATCH_SIZE) {
      const batch = seriesIds.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(batch.map(fetchSeries));
      for (const [id, data] of batchResults) {
        results[id] = data;
      }
      // Small delay between batches to avoid rate limiting
      if (i + BATCH_SIZE < seriesIds.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    macroCache[cacheKey] = { data: results, ts: now };
    return { data: results, error: null, cached: false };
  } catch (err: any) {
    return { data: MOCK_DATA, error: err.message || 'API error, using mock data', cached: false };
  }
}
