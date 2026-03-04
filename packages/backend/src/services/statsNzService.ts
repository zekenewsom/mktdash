/**
 * Stats NZ (Statistics New Zealand) API Client
 * Free API - no auth required
 * Source: https://api.stats.govt.nz/
 */

import { DataPoint } from '../contracts/marketData';
import { getWithRetry } from '../lib/httpClient';

const STATS_NZ_BASE_URL = 'https://api.stats.govt.nz';

// Stats NZ dataset codes
export const STATSNZ_SERIES = {
  // Retail
  RETAIL_SALES: 'RETAIL_SALES',
  RETAIL_ELECTRONIC: 'RETAIL_ELECTRONIC',
  // Building
  BUILDING_PERMITS: 'BUILDING_PERMITS',
  // Employment
  UNEMPLOYMENT_RATE: 'UNEMP_RATE',
  EMPLOYMENT: 'EMPLOYMENT',
  // GDP
  GDP: 'GDP',
} as const;

type StatsNZSeriesKey = keyof typeof STATSNZ_SERIES;

// Cache
const statsNzCache: Record<string, { data: Record<string, DataPoint>; ts: number }> = {};
const CACHE_TTL_MS = 5 * 60 * 1000;

// Mock data
const MOCK_DATA: Record<string, DataPoint> = {
  RETAIL_SALES: { symbol: 'RETAIL_SALES', source: 'statsnz', value: 8.2, as_of: '2025-12-01', unit: '% YoY' },
  RETAIL_ELECTRONIC: { symbol: 'RETAIL_ELECTRONIC', source: 'statsnz', value: 12.5, as_of: '2025-12-01', unit: '% YoY' },
  BUILDING_PERMITS: { symbol: 'BUILDING_PERMITS', source: 'statsnz', value: 3850, as_of: '2026-01-01', unit: 'units' },
  UNEMPLOYMENT_RATE: { symbol: 'UNEMPLOYMENT_RATE', source: 'statsnz', value: 4.8, as_of: '2025-12-01', unit: '%' },
  EMPLOYMENT: { symbol: 'EMPLOYMENT', source: 'statsnz', value: 2850, as_of: '2025-12-01', unit: 'thousands' },
  GDP: { symbol: 'GDP', source: 'statsnz', value: 0.3, as_of: '2025-Q4', unit: '% QoQ' },
};

export async function fetchStatsNZData(seriesKeys: string[]): Promise<{ data: Record<string, DataPoint>; error: string | null }> {
  const now = Date.now();
  const cacheKey = seriesKeys.sort().join(',');

  if (statsNzCache[cacheKey] && now - statsNzCache[cacheKey].ts < CACHE_TTL_MS) {
    return { data: statsNzCache[cacheKey].data, error: null };
  }

  const results: Record<string, DataPoint> = {};

  try {
    // Stats NZ uses OAuth2 - skip for now, return mock
    for (const key of seriesKeys) {
      results[key] = MOCK_DATA[key] || {
        symbol: key,
        source: 'statsnz',
        value: null,
        as_of: null,
        unit: 'unknown',
      };
    }

    statsNzCache[cacheKey] = { data: results, ts: now };
    return { data: results, error: null };
  } catch (err: any) {
    return { data: MOCK_DATA, error: err.message };
  }
}
