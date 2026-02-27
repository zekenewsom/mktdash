import { getWithRetry } from '../lib/httpClient';

export interface CalendarEvent {
  id: string;
  title: string;
  country: string;
  impact: 'high' | 'medium' | 'low';
  scheduled_at: string;
  category: 'inflation' | 'labor' | 'growth' | 'policy' | 'other';
  source: string;
}

const FRED_API_KEY = process.env.FRED_API_KEY;
const FRED_BASE = 'https://api.stlouisfed.org/fred';
const CALENDAR_CACHE_TTL_MS = Number(process.env.CALENDAR_CACHE_TTL_MS || 60 * 60 * 1000);

const SERIES_CALENDAR_MAP = [
  { seriesId: 'CPIAUCSL', title: 'US CPI Release', impact: 'high' as const, category: 'inflation' as const },
  { seriesId: 'UNRATE', title: 'US Unemployment Rate', impact: 'high' as const, category: 'labor' as const },
  { seriesId: 'FEDFUNDS', title: 'Fed Funds Rate Update', impact: 'high' as const, category: 'policy' as const },
];

const calendarCache: { data: CalendarEvent[] | null; ts: number; error: string | null } = {
  data: null,
  ts: 0,
  error: null,
};

function scaffoldEvents() {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const events: CalendarEvent[] = [
    {
      id: 'evt-cpi-scaffold',
      title: 'US CPI Release',
      country: 'US',
      impact: 'high',
      scheduled_at: new Date(now + oneDay).toISOString(),
      category: 'inflation',
      source: 'calendar-scaffold',
    },
    {
      id: 'evt-unrate-scaffold',
      title: 'US Unemployment Rate',
      country: 'US',
      impact: 'high',
      scheduled_at: new Date(now + 2 * oneDay).toISOString(),
      category: 'labor',
      source: 'calendar-scaffold',
    },
  ];

  return { data: events, error: 'FRED calendar unavailable; using scaffold events', cached: false };
}

async function fetchReleaseIdForSeries(seriesId: string) {
  const url = `${FRED_BASE}/series/release?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json`;
  const resp = await getWithRetry(url);
  return (resp.data as any)?.releases?.[0]?.id as number | undefined;
}

async function fetchUpcomingReleaseDate(releaseId: number) {
  const today = new Date().toISOString().slice(0, 10);
  const end = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString().slice(0, 10);

  const url = `${FRED_BASE}/release/dates?release_id=${releaseId}&api_key=${FRED_API_KEY}&file_type=json&realtime_start=${today}&realtime_end=${end}&include_release_dates_with_no_data=true`;
  const resp = await getWithRetry(url);
  const dates: Array<{ date: string }> = (resp.data as any)?.release_dates || [];
  const sorted = dates
    .map((d) => d.date)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
  return sorted.find((d) => d >= today) || null;
}

export async function fetchEconomicCalendar() {
  const now = Date.now();
  if (calendarCache.data && now - calendarCache.ts < CALENDAR_CACHE_TTL_MS) {
    return { data: calendarCache.data, error: calendarCache.error, cached: true };
  }

  if (!FRED_API_KEY) {
    return scaffoldEvents();
  }

  try {
    const events: CalendarEvent[] = [];

    for (const item of SERIES_CALENDAR_MAP) {
      try {
        const releaseId = await fetchReleaseIdForSeries(item.seriesId);
        if (!releaseId) continue;

        const nextDate = await fetchUpcomingReleaseDate(releaseId);
        if (!nextDate) continue;

        events.push({
          id: `${item.seriesId}-${nextDate}`,
          title: item.title,
          country: 'US',
          impact: item.impact,
          scheduled_at: new Date(`${nextDate}T13:30:00Z`).toISOString(),
          category: item.category,
          source: 'fred',
        });
      } catch {
        // continue collecting others; partial output is fine
      }
    }

    if (events.length === 0) {
      return scaffoldEvents();
    }

    events.sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at));
    calendarCache.data = events;
    calendarCache.ts = now;
    calendarCache.error = null;

    return {
      data: events,
      error: null,
      cached: false,
    };
  } catch (err: any) {
    const fallback = scaffoldEvents();
    calendarCache.data = fallback.data;
    calendarCache.ts = now;
    calendarCache.error = err.message || fallback.error;
    return { ...fallback, error: err.message || fallback.error };
  }
}
