import axios from 'axios';

const FRED_API_KEY = process.env.FRED_API_KEY;
const FRED_BASE_URL = 'https://api.stlouisfed.org/fred/series/observations';

const INDEX_SERIES = {
  SP500: 'SP500',       // S&P 500 Index
  NASDAQCOM: 'NASDAQCOM', // Nasdaq Composite
  DJIA: 'DJIA',    // Dow Jones Industrial Average
};

const MOCK_DATA = {
  SP500: { value: 5200.12, date: '2025-05-01' },
  NASDAQCOM: { value: 16000.56, date: '2025-05-01' },
  DJIA: { value: 35000.78, date: '2025-05-01' },
};

type IndexKey = keyof typeof INDEX_SERIES;

async function fetchFredIndex(seriesId: string) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const url = `${FRED_BASE_URL}?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&observation_end=${today}`;
  try {
    const resp = await axios.get(url);
    const obsArr = resp.data.observations || [];
    const obs = obsArr.length > 0 ? obsArr[obsArr.length - 1] : undefined;
    if (obs && obs.value !== '.') {
      return { value: parseFloat(obs.value), date: obs.date };
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}

const indexHistoryCache: Record<string, { data: any[]; lastFetched: number }> = {};
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function fetchIndexPerformance() {
  // Return { value, date, change, percentChange } for each index
  try {
    const results: Record<IndexKey, any> = {} as Record<IndexKey, any>;
    for (const key of Object.keys(INDEX_SERIES) as IndexKey[]) {
      const seriesId = INDEX_SERIES[key];
      const today = new Date().toISOString().slice(0, 10);
      const url = `${FRED_BASE_URL}?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&observation_end=${today}`;
      try {
        const resp = await axios.get(url);
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
            results[key] = { value, date: last.date, change, percentChange };
            continue;
          }
        }
        // Fallback if not enough data or missing values
        if (n > 0 && obsArr[n - 1].value !== '.') {
          const value = parseFloat(obsArr[n - 1].value);
          results[key] = { value, date: obsArr[n - 1].date, change: 0, percentChange: 0 };
        } else {
          results[key] = MOCK_DATA[key];
        }
      } catch (err) {
        results[key] = MOCK_DATA[key];
      }
    }
    return { data: results, error: null };
  } catch (err: any) {
    return { data: MOCK_DATA, error: err.message || 'API error, using mock data' };
  }
}

// Fetch historical data for any FRED series with in-memory caching
export async function fetchFredSeriesHistory(seriesId: string) {
  const now = Date.now();
  if (
    indexHistoryCache[seriesId] &&
    now - indexHistoryCache[seriesId].lastFetched < CACHE_TTL_MS
  ) {
    return { data: indexHistoryCache[seriesId].data, error: null, cached: true };
  }
  const url = `${FRED_BASE_URL}?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json`;
  console.log('FRED URL:', url); // Debug log
  try {
    const resp = await axios.get(url);
    const obsArr = resp.data.observations || [];
    const data = obsArr
      .filter((obs: any) => obs.value !== '.')
      .map((obs: any) => ({ date: obs.date, value: parseFloat(obs.value) }));
    indexHistoryCache[seriesId] = { data, lastFetched: now };
    return { data, error: null, cached: false };
  } catch (err: any) {
    console.error('FRED fetch error for', seriesId, ':', err);
    return { data: [], error: err.message || 'API error', cached: false };
  }
}

// Historical index data (for backwards compatibility)
export async function fetchIndexHistory(seriesId: string) {
  return fetchFredSeriesHistory(seriesId);
}

// Optional: clear cache for testing/debugging
export function clearIndexHistoryCache() {
  Object.keys(indexHistoryCache).forEach(k => delete indexHistoryCache[k]);
}
