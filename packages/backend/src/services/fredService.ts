import axios from 'axios';
import { DataPoint } from '../contracts/marketData';

const FRED_API_KEY = process.env.FRED_API_KEY;
const FRED_BASE_URL = 'https://api.stlouisfed.org/fred/series/observations';
const HTTP_TIMEOUT_MS = Number(process.env.HTTP_TIMEOUT_MS || 8000);
const PROVIDER_MODE = process.env.DATA_PROVIDER_MODE || 'live_with_fallback';

const MOCK_DATA: Record<string, DataPoint> = {
  FEDFUNDS: { symbol: 'FEDFUNDS', source: 'mock', value: 5.33, as_of: '2025-05-01', unit: '%' },
  CPIAUCSL: { symbol: 'CPIAUCSL', source: 'mock', value: 312.332, as_of: '2025-04-01', unit: 'index' },
  UNRATE: { symbol: 'UNRATE', source: 'mock', value: 3.8, as_of: '2025-04-01', unit: '%' },
};

export async function fetchMacroData(seriesIds: string[]) {
  const useMockOnly = PROVIDER_MODE === 'mock_only' || !FRED_API_KEY;

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
        const resp = await axios.get(url, { timeout: HTTP_TIMEOUT_MS });
        const obsArr = resp.data.observations || [];
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

    return { data: results, error: null };
  } catch (err: any) {
    return { data: MOCK_DATA, error: err.message || 'API error, using mock data' };
  }
}
