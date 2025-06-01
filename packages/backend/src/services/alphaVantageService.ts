import axios from 'axios';
import Papa from 'papaparse';

const ALPHAVANTAGE_API_KEY = process.env.ALPHAVANTAGE_API_KEY;
const ALPHAVANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

export interface EconomicEvent {
  event: string;
  country: string;
  date: string;
  time?: string;
  importance?: string;
  actual?: string;
  forecast?: string;
  previous?: string;
  [key: string]: any;
}

const calendarCache: {
  data: EconomicEvent[] | null;
  lastFetched: number | null;
  horizon: string | null;
} = {
  data: null,
  lastFetched: null,
  horizon: null,
};
const CALENDAR_CACHE_TTL_MS = 4 * 60 * 60 * 1000;

export async function getEconomicCalendar(
  horizon: '3month' | '6month' | '12month' = '3month'
): Promise<{ data: EconomicEvent[] | null; error?: string }> {
  if (!ALPHAVANTAGE_API_KEY) {
    console.error('Alpha Vantage API key is missing.');
    return { data: null, error: 'Alpha Vantage API key is missing.' };
  }
  const now = Date.now();
  if (
    calendarCache.data &&
    calendarCache.lastFetched &&
    calendarCache.horizon === horizon &&
    (now - calendarCache.lastFetched < CALENDAR_CACHE_TTL_MS)
  ) {
    console.log(`Serving economic calendar for ${horizon} from cache.`);
    return { data: calendarCache.data };
  }
  console.log(`Fetching economic calendar for ${horizon} from Alpha Vantage.`);
  try {
    const response = await axios.get(ALPHAVANTAGE_BASE_URL, {
      params: {
        function: 'ECONOMIC_CALENDAR',
        horizon: horizon,
        apikey: ALPHAVANTAGE_API_KEY,
      },
      responseType: 'text',
    });
    // Debug: log raw response
    console.debug('Alpha Vantage raw response:', response.data);
    if (typeof response.data !== 'string' || response.data.trim() === '' || response.data.includes('Thank you for using Alpha Vantage') || response.data.toLowerCase().includes('error')) {
      const errorMsg = response.data.includes('Thank you for using Alpha Vantage') ?
        'Alpha Vantage API limit likely reached or invalid request.' :
        'Received empty or invalid data from Alpha Vantage economic calendar.';
      console.error(errorMsg, response.data);
      if (calendarCache.data && calendarCache.horizon === horizon) {
        console.warn('Returning stale cache due to API error fetching calendar.');
        return { data: calendarCache.data, error: errorMsg + ' (serving stale data)' };
      }
      return { data: null, error: errorMsg + ' (raw response: ' + String(response.data).slice(0, 200) + ')' };
    }
    const parseResult = Papa.parse<EconomicEvent>(response.data, {
      header: true,
      skipEmptyLines: true,
      transformHeader: header => header.trim().toLowerCase().replace(/\s+/g, '_'),
    });
    if (parseResult.errors.length > 0) {
      console.error('Error parsing economic calendar CSV:', parseResult.errors);
      return { data: null, error: 'Failed to parse calendar data.' };
    }
    const events = parseResult.data.map(event => ({
      ...event,
      event: event.event_name || event.event || "N/A",
      importance: event.impact || event.importance,
    })).sort((a, b) => {
      const dateA = new Date(a.date + (a.time ? ' ' + a.time.replace(' ET', '') : ' 00:00')).getTime();
      const dateB = new Date(b.date + (b.time ? ' ' + b.time.replace(' ET', '') : ' 00:00')).getTime();
      return dateA - dateB;
    });
    calendarCache.data = events;
    calendarCache.lastFetched = now;
    calendarCache.horizon = horizon;
    return { data: events };
  } catch (err: any) {
    console.error('Alpha Vantage API error for economic calendar:', err.response?.data || err.message);
    const errorMsg = err.response?.data?.Information || err.message || 'Failed to fetch economic calendar';
    if (err.response?.status === 429 || (typeof errorMsg === 'string' && errorMsg.includes("API call frequency"))) {
      return { data: null, error: `Alpha Vantage API rate limit hit. Please try again later. (${errorMsg})` };
    }
    if (calendarCache.data && calendarCache.horizon === horizon) {
      console.warn("Returning stale cache due to API error fetching calendar.");
      return { data: calendarCache.data, error: errorMsg + " (serving stale data)" };
    }
    return { data: null, error: errorMsg };
  }
}
