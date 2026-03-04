/**
 * Brazil Central Bank (BCB) API Client
 * Free API - no auth required
 * Source: https://api.bcb.gov.br/
 */

import { DataPoint } from '../contracts/marketData';
import { getWithRetry } from '../lib/httpClient';

const BCB_BASE_URL = 'https://api.bcb.gov.br/dados/serie';

// BCB series codes (SGS system)
export const BCB_SERIES = {
  // Credit
  CREDIT_OBSERVED: '20795',  // Credit Outstanding - Total
  CREDIT_NON_PERFORMING: '21082',  // Non-performing loans ratio
  // Inflation
  IPCA: '433',  // IPCA (Consumer price index)
  IPCA_YOY: '13522',  // IPCA Year-over-Year
  // Unemployment
  UNEMPLOYMENT: '24369',  // Unemployment rate (PNAD)
  // Trade
  TRADE_BALANCE: '22700',  // Trade Balance
  // Output Gap
  IBC_BR: '24364',  // Economic Activity Index (IBC-Br)
} as const;

type BCSeriesKey = keyof typeof BCB_SERIES;

// Cache
const bcbCache: Record<string, { data: Record<string, DataPoint>; ts: number }> = {};
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function fetchBCBData(seriesKeys: string[]): Promise<{ data: Record<string, DataPoint>; error: string | null }> {
  const now = Date.now();
  const cacheKey = seriesKeys.sort().join(',');

  if (bcbCache[cacheKey] && now - bcbCache[cacheKey].ts < CACHE_TTL_MS) {
    return { data: bcbCache[cacheKey].data, error: null };
  }

  const results: Record<string, DataPoint> = {};

  // Mock data for development
  const MOCK_DATA: Record<string, DataPoint> = {
    CREDIT_OBSERVED: { symbol: 'CREDIT_OBSERVED', source: 'bcb', value: 5823.4, as_of: '2026-01-01', unit: 'billion BRL' },
    CREDIT_NON_PERFORMING: { symbol: 'CREDIT_NON_PERFORMING', source: 'bcb', value: 3.2, as_of: '2026-01-01', unit: '%' },
    IPCA: { symbol: 'IPCA', source: 'bcb', value: 4.62, as_of: '2026-02-01', unit: '%' },
    IPCA_YOY: { symbol: 'IPCA_YOY', source: 'bcb', value: 4.62, as_of: '2026-02-01', unit: '%' },
    UNEMPLOYMENT: { symbol: 'UNEMPLOYMENT', source: 'bcb', value: 7.5, as_of: '2026-01-01', unit: '%' },
    TRADE_BALANCE: { symbol: 'TRADE_BALANCE', source: 'bcb', value: 5.2, as_of: '2026-02-01', unit: 'billion USD' },
    IBC_BR: { symbol: 'IBC_BR', source: 'bcb', value: 135.8, as_of: '2026-01-01', unit: 'index' },
  };

  try {
    for (const key of seriesKeys) {
      const seriesId = BCB_SERIES[key as BCSeriesKey] || key;
      
      try {
        // BCB API format: /serie/bcdata.SGS.{id}/dados?formato=json
        const url = `${BCB_BASE_URL}/bcdata.S.GS.${seriesId}/dados?formato=json`;
        const resp = await getWithRetry(url);
        
        if (resp.data && Array.isArray(resp.data) && resp.data.length > 0) {
          const obs = resp.data[resp.data.length - 1];
          results[key] = {
            symbol: key,
            source: 'bcb',
            value: parseFloat(obs.valor),
            as_of: obs.data,
            unit: getUnitForBCB(key),
          };
        }
      } catch {
        results[key] = MOCK_DATA[key] || {
          symbol: key,
          source: 'bcb',
          value: null,
          as_of: null,
          unit: 'unknown',
        };
      }
    }

    bcbCache[cacheKey] = { data: results, ts: now };
    return { data: results, error: null };
  } catch (err: any) {
    return { data: {}, error: err.message };
  }
}

function getUnitForBCB(key: string): string {
  const units: Record<string, string> = {
    CREDIT_OBSERVED: 'billion BRL',
    CREDIT_NON_PERFORMING: '%',
    IPCA: '%',
    IPCA_YOY: '%',
    UNEMPLOYMENT: '%',
    TRADE_BALANCE: 'billion USD',
    IBC_BR: 'index',
  };
  return units[key] || 'unknown';
}
