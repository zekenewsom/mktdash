import axios from 'axios';

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
const HTTP_TIMEOUT_MS = Number(process.env.HTTP_TIMEOUT_MS || 8000);
const FRED_BASE = 'https://api.stlouisfed.org/fred';

const SERIES_CALENDAR_MAP = [
  { seriesId: 'CPIAUCSL', title: 'US CPI Release', impact: 'high' as const, category: 'inflation' as const },
  { seriesId: 'UNRATE', title: 'US Unemployment Rate', impact: 'high' as const, category: 'labor' as const },
  { seriesId: 'FEDFUNDS', title: 'Fed Funds Rate Update', impact: 'high' as const, category: 'policy' as const },
];

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

  return { data: events, error: 'FRED calendar unavailable; using scaffold events' };
}

async function fetchReleaseIdForSeries(seriesId: string) {
  const url = `${FRED_BASE}/series/release?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json`;
  const resp = await axios.get(url, { timeout: HTTP_TIMEOUT_MS });
  return resp?.data?.releases?.[0]?.id as number | undefined;
}

async function fetchUpcomingReleaseDate(releaseId: number) {
  const today = new Date().toISOString().slice(0, 10);
  const end = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString().slice(0, 10);

  const url = `${FRED_BASE}/release/dates?release_id=${releaseId}&api_key=${FRED_API_KEY}&file_type=json&realtime_start=${today}&realtime_end=${end}&include_release_dates_with_no_data=true`;
  const resp = await axios.get(url, { timeout: HTTP_TIMEOUT_MS });
  const dates: Array<{ date: string }> = resp?.data?.release_dates || [];
  const sorted = dates
    .map((d) => d.date)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
  return sorted.find((d) => d >= today) || null;
}

export async function fetchEconomicCalendar() {
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

    return {
      data: events,
      error: null,
    };
  } catch (err: any) {
    const fallback = scaffoldEvents();
    return { ...fallback, error: err.message || fallback.error };
  }
}
