import axios from 'axios';
import { DataPoint, findDataPointOnOrBefore, getPastDates, calculatePerformance, calculateSMA, getDataForLastNDays } from '../utils/dateUtils';

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

const indexHistoryCache: Record<string, { data: any[]; lastFetched: number; seriesInfo?: any }> = {};
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
export async function fetchFredSeriesHistory(seriesId: string, forceRefresh: boolean = false): Promise<{ data: DataPoint[]; error: string | null; cached: boolean; seriesInfo?: any }> {
  const now = Date.now();
  if (
    !forceRefresh &&
    indexHistoryCache[seriesId] &&
    now - indexHistoryCache[seriesId].lastFetched < CACHE_TTL_MS
  ) {
    return { data: indexHistoryCache[seriesId].data, error: null, cached: true, seriesInfo: indexHistoryCache[seriesId].seriesInfo };
  }

  const seriesUrl = `https://api.stlouisfed.org/fred/series?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json`;
  const observationsUrl = `${FRED_BASE_URL}?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&sort_order=asc`;

  try {
    const [seriesInfoRes, observationsRes] = await Promise.all([
        axios.get(seriesUrl),
        axios.get(observationsUrl)
    ]);
    
    const seriesInfo = seriesInfoRes.data.seriess && seriesInfoRes.data.seriess.length > 0 ? seriesInfoRes.data.seriess[0] : {};

    const obsArr = observationsRes.data.observations || [];
    const historicalData: DataPoint[] = obsArr
      .filter((obs: any) => obs.value !== '.')
      .map((obs: any) => ({ date: obs.date, value: parseFloat(obs.value) }));

    indexHistoryCache[seriesId] = { data: historicalData, lastFetched: now, seriesInfo };
    return { data: historicalData, error: null, cached: false, seriesInfo };
  } catch (err: any) {
    console.error('FRED fetch error for series history', seriesId, ':', err.message);
    if (indexHistoryCache[seriesId]) {
        console.warn(`Returning stale cache for ${seriesId} due to fetch error.`);
        return { ...indexHistoryCache[seriesId], error: err.message || 'API error, using stale cache', cached: true};
    }
    return { data: [], error: err.message || 'API error', cached: false };
  }
}

// --- NEW FUNCTION: getSeriesDetails ---
export async function getSeriesDetails(seriesId: string) {
  try {
    const historyResult = await fetchFredSeriesHistory(seriesId);
    if (historyResult.error && historyResult.data.length === 0) { // If error and no cached data
      return { data: null, error: `Failed to fetch data for ${seriesId}: ${historyResult.error}` };
    }

    const historicalData = historyResult.data;
    const seriesInfo = historyResult.seriesInfo || {};

    if (historicalData.length === 0) {
      return { data: { seriesInfo, historical: [], metrics: {}, currentValue: null }, error: 'No historical data available.' };
    }

    const latestDataPoint = historicalData[historicalData.length - 1];
    const currentDate = new Date(latestDataPoint.date); // Use date of latest data point as current
    currentDate.setUTCHours(0,0,0,0); // Normalize to start of day UTC

    const datesForMetrics = getPastDates(currentDate);

    const metrics: Record<string, any> = {};
    const periods: Record<string, Date> = {
      '1D': datesForMetrics.oneDayAgo,
      '1W': datesForMetrics.oneWeekAgo,
      '1M': datesForMetrics.oneMonthAgo,
      '3M': datesForMetrics.threeMonthsAgo,
      '6M': datesForMetrics.sixMonthsAgo,
      '1Y': datesForMetrics.oneYearAgo,
    };

    for (const periodKey in periods) {
      const pastDataPoint = findDataPointOnOrBefore(historicalData, periods[periodKey]);
      metrics[periodKey] = calculatePerformance(latestDataPoint.value, pastDataPoint?.value);
      metrics[periodKey].pastDate = pastDataPoint?.date || null;
      metrics[periodKey].pastValue = pastDataPoint?.value || null;
    }
    
    // YTD Calculation
    const ytdStartDate = datesForMetrics.lastDayOfPrevYear; // Value at end of last year
    const ytdStartPoint = findDataPointOnOrBefore(historicalData, ytdStartDate);
    metrics['YTD'] = calculatePerformance(latestDataPoint.value, ytdStartPoint?.value);
    metrics['YTD'].pastDate = ytdStartPoint?.date || null;
    metrics['YTD'].pastValue = ytdStartPoint?.value || null;

    // Filter historical data for chart (e.g., last 5 years, or all)
    // For now, return all historical data fetched. Can add duration filter later.
    const chartData = historicalData; // Can be further processed/filtered if needed

    // --- NEW: Analytical Metrics Calculation ---
    const analyticalMetrics: Record<string, any> = {};
    // Moving Averages
    analyticalMetrics['sma50'] = calculateSMA(historicalData, 50);
    analyticalMetrics['sma200'] = calculateSMA(historicalData, 200);
    // 52-Week High/Low (approx 365 days)
    const lastYearData = getDataForLastNDays(historicalData, currentDate, 365);
    if (lastYearData.length > 0) {
      let yearlyHigh: DataPoint = lastYearData[0];
      let yearlyLow: DataPoint = lastYearData[0];
      for (const point of lastYearData) {
        if (point.value > yearlyHigh.value) yearlyHigh = point;
        if (point.value < yearlyLow.value) yearlyLow = point;
      }
      analyticalMetrics['yearlyHigh'] = yearlyHigh;
      analyticalMetrics['yearlyLow'] = yearlyLow;
    } else {
      analyticalMetrics['yearlyHigh'] = null;
      analyticalMetrics['yearlyLow'] = null;
    }
    // --- End of Analytical Metrics ---

    return {
      data: {
        seriesInfo: {
            id: seriesInfo.id,
            title: seriesInfo.title,
            units_short: seriesInfo.units_short,
            seasonal_adjustment_short: seriesInfo.seasonal_adjustment_short,
            frequency_short: seriesInfo.frequency_short,
            notes: seriesInfo.notes, // Might be too long for overview
            last_updated: seriesInfo.last_updated,
        },
        currentValue: latestDataPoint,
        historical: chartData,
        metrics,
        analyticalMetrics, // NEW: Added analytical metrics
      },
      error: historyResult.error,
    };

  } catch (err: any) {
    console.error(`Error in getSeriesDetails for ${seriesId}:`, err);
    return { data: null, error: err.message || `Unknown error fetching details for ${seriesId}` };
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
