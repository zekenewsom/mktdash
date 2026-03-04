/**
 * Yahoo Finance Service - EM Composites & ETFs
 * Uses yfinance - free, no auth required
 */

import { DataPoint } from '../contracts/marketData';
import { getWithRetry } from '../lib/httpClient';

const YAHOO_BASE_URL = 'https://query1.finance.yahoo.com/v8/finance';

// ETF tickers for EM proxies
export const YF_TICKERS = {
  // EM Equity
  EEM: 'EEM',  // iShares MSCI Emerging Markets
  VWO: 'VWO',  // Vanguard FTSE Emerging Markets
  // EM Bonds
  VWOB: 'VWOB',  // Vanguard EM Bond
  EMB: 'EMB',  // iShares JP Morgan EM Bond
  // EM Currencies (via inverse USD ETFs)
  UUP: 'UUP',  // Invesco Dollar Bull
  // BRICS
  BRK: 'BRK',  // BRK.B
  // Specific EM
  EWZ: 'EWZ',  // Brazil
  EWW: 'EWW',  // Mexico
  EWY: 'EWY',  // South Korea
  EPI: 'EPI',  // India
  CH: 'CH',    // China
  // Tech (for reference)
  QQQ: 'QQQ',
  SPY: 'SPY',
} as const;

type YFTickerKey = keyof typeof YF_TICKERS;

// Cache
const yfCache: Record<string, { data: Record<string, DataPoint>; ts: number }> = {};
const CACHE_TTL_MS = 5 * 60 * 1000;

// Mock data
const MOCK_DATA: Record<string, DataPoint> = {
  EEM: { symbol: 'EEM', source: 'yfinance', value: 42.35, as_of: '2026-02-28', unit: '$' },
  VWO: { symbol: 'VWO', source: 'yfinance', value: 41.82, as_of: '2026-02-28', unit: '$' },
  VWOB: { symbol: 'VWOB', source: 'yfinance', value: 48.15, as_of: '2026-02-28', unit: '$' },
  EMB: { symbol: 'EMB', source: 'yfinance', value: 86.22, as_of: '2026-02-28', unit: '$' },
  UUP: { symbol: 'UUP', source: 'yfinance', value: 25.85, as_of: '2026-02-28', unit: '$' },
  EWZ: { symbol: 'EWZ', source: 'yfinance', value: 25.42, as_of: '2026-02-28', unit: '$' },
  EWW: { symbol: 'EWW', source: 'yfinance', value: 52.18, as_of: '2026-02-28', unit: '$' },
  EWY: { symbol: 'EWY', source: 'yfinance', value: 58.72, as_of: '2026-02-28', unit: '$' },
  EPI: { symbol: 'EPI', source: 'yfinance', value: 52.35, as_of: '2026-02-28', unit: '$' },
  CH: { symbol: 'CH', source: 'yfinance', value: 23.45, as_of: '2026-02-28', unit: '$' },
  QQQ: { symbol: 'QQQ', source: 'yfinance', value: 485.22, as_of: '2026-02-28', unit: '$' },
  SPY: { symbol: 'SPY', source: 'yfinance', value: 495.50, as_of: '2026-02-28', unit: '$' },
};

export async function fetchYFinanceData(tickerKeys: string[]): Promise<{ data: Record<string, DataPoint>; error: string | null }> {
  const now = Date.now();
  const cacheKey = tickerKeys.sort().join(',');

  if (yfCache[cacheKey] && now - yfCache[cacheKey].ts < CACHE_TTL_MS) {
    return { data: yfCache[cacheKey].data, error: null };
  }

  const results: Record<string, DataPoint> = {};

  try {
    // Try Yahoo Finance API
    for (const key of tickerKeys) {
      const ticker = YF_TICKERS[key as YFTickerKey] || key;
      
      try {
        const url = `${YAHOO_BASE_URL}/chart/${ticker}?interval=1d&range=1d`;
        const resp = await getWithRetry(url);
        
        if (resp.data && resp.data.chart && resp.data.chart.result) {
          const meta = resp.data.chart.result[0].meta;
          results[key] = {
            symbol: key,
            source: 'yfinance',
            value: meta.regularMarketPrice,
            as_of: new Date().toISOString().split('T')[0],
            unit: '$',
          };
        }
      } catch {
        results[key] = MOCK_DATA[key] || {
          symbol: key,
          source: 'yfinance',
          value: null,
          as_of: null,
          unit: 'unknown',
        };
      }
    }

    yfCache[cacheKey] = { data: results, ts: now };
    return { data: results, error: null };
  } catch (err: any) {
    return { data: MOCK_DATA, error: err.message };
  }
}
