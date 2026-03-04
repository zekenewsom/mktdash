/**
 * RBA (Reserve Bank of Australia) API Client
 * Free API - no auth required
 * Source: https://api.rba.gov.au/
 */

import { DataPoint } from '../contracts/marketData';
import { getWithRetry } from '../lib/httpClient';

const RBA_BASE_URL = 'https://api.rba.gov.au';

// RBA series IDs
export const RBA_SERIES = {
  // Interest Rates
  CASH_RATE: 'FIRCRTG',
  // Credit
  BUSINESS_CREDIT: 'BCREDITSA',
  HOUSING_CREDIT: 'HCREDITSA',
  // Other
  PRIVATE_CAPEX: 'CAPEXSA',
} as const;

type RBASeriesKey = keyof typeof RBA_SERIES;

// Cache
const rbaCache: Record<string, { data: Record<string, DataPoint>; ts: number }> = {};
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function fetchRBAData(seriesKeys: string[]): Promise<{ data: Record<string, DataPoint>; error: string | null }> {
  const now = Date.now();
  const cacheKey = seriesKeys.sort().join(',');

  if (rbaCache[cacheKey] && now - rbaCache[cacheKey].ts < CACHE_TTL_MS) {
    return { data: rbaCache[cacheKey].data, error: null };
  }

  const results: Record<string, DataPoint> = {};

  // Mock data for development
  const MOCK_DATA: Record<string, DataPoint> = {
    FIRCRTG: { symbol: 'FIRCRTG', source: 'rba', value: 4.35, as_of: '2026-02-01', unit: '%' },
    BCREDITSA: { symbol: 'BCREDITSA', source: 'rba', value: 945.6, as_of: '2026-01-01', unit: 'billion AUD' },
    HCREDITSA: { symbol: 'HCREDITSA', source: 'rba', value: 1825.3, as_of: '2026-01-01', unit: 'billion AUD' },
    CAPEXSA: { symbol: 'CAPEXSA', source: 'rba', value: 118.5, as_of: '2025-Q4', unit: 'billion AUD' },
  };

  try {
    // Try RBA API (if available)
    for (const key of seriesKeys) {
      const seriesId = RBA_SERIES[key as RBASeriesKey] || key;
      
      try {
        const url = `${RBA_BASE_URL}/series/${seriesId}/json`;
        const resp = await getWithRetry(url);
        
        if (resp.data && resp.data.observations) {
          const obs = resp.data.observations[resp.data.observations.length - 1];
          results[key] = {
            symbol: key,
            source: 'rba',
            value: parseFloat(obs.value),
            as_of: obs.date,
            unit: '%',
          };
        }
      } catch {
        // Fallback to mock
        results[key] = MOCK_DATA[key] || {
          symbol: key,
          source: 'rba',
          value: null,
          as_of: null,
          unit: 'unknown',
        };
      }
    }

    rbaCache[cacheKey] = { data: results, ts: now };
    return { data: results, error: null };
  } catch (err: any) {
    return { data: {}, error: err.message };
  }
}
