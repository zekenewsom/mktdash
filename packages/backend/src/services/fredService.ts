import axios from 'axios';
import { fetchWithRetry } from '../utils/fetchWithRetry';

const FRED_API_KEY = process.env.FRED_API_KEY;
console.log('Loaded FRED API KEY:', FRED_API_KEY);
const FRED_BASE_URL = 'https://api.stlouisfed.org/fred/series/observations';

// Mock fallback data for macro indicators
const MOCK_DATA = {
  FEDFUNDS: { value: 5.33, date: '2025-05-01' },
  CPIAUCSL: { value: 312.332, date: '2025-04-01' },
  UNRATE: { value: 3.8, date: '2025-04-01' },
};

/**
 * Fetch latest macroeconomic data from FRED API for given series IDs.
 * Falls back to mock data on error.
 */
export async function fetchMacroData(seriesIds: string[]) {
  try {
    const results: Record<string, any> = {};
    for (const id of seriesIds) {
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const url = `${FRED_BASE_URL}?series_id=${id}&api_key=${FRED_API_KEY}&file_type=json&observation_end=${today}`;
      console.log('FRED URL:', url); // Debug URL
      try {
        const resp = await fetchWithRetry(url);
        const obsArr = resp.data.observations || [];
        const obs = obsArr.length > 0 ? obsArr[obsArr.length - 1] : undefined;
        // Handle FRED missing value '.'
        if (obs && obs.value !== '.') {
          results[id] = { value: parseFloat(obs.value), date: obs.date };
        } else {
          results[id] = { value: null, date: obs?.date || null, error: 'No data' };
        }
      } catch (err: any) {
        // Log error details for this series
        console.error(`FRED fetch error for ${id}:`, err?.response?.data || err.message);
        results[id] = { value: null, date: null, error: err.message || 'API error' };
      }
    }
    return { data: results, error: null };
  } catch (err: any) {
    // Fallback to mock data
    console.error('FRED global error:', err?.response?.data || err.message);
    return { data: MOCK_DATA, error: err.message || 'API error, using mock data' };
  }
}
