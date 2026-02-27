export interface CalendarEvent {
  id: string;
  title: string;
  country: string;
  impact: 'high' | 'medium' | 'low';
  scheduled_at: string;
  category: 'inflation' | 'labor' | 'growth' | 'policy' | 'other';
  source: string;
}

// Scaffold: replace with live free-source ingestion in next iteration.
export async function fetchEconomicCalendar() {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  const events: CalendarEvent[] = [
    {
      id: 'evt-cpi',
      title: 'US CPI Release',
      country: 'US',
      impact: 'high',
      scheduled_at: new Date(now + oneDay).toISOString(),
      category: 'inflation',
      source: 'calendar-scaffold',
    },
    {
      id: 'evt-claims',
      title: 'US Initial Jobless Claims',
      country: 'US',
      impact: 'medium',
      scheduled_at: new Date(now + 2 * oneDay).toISOString(),
      category: 'labor',
      source: 'calendar-scaffold',
    },
    {
      id: 'evt-fomc',
      title: 'FOMC Minutes',
      country: 'US',
      impact: 'high',
      scheduled_at: new Date(now + 3 * oneDay).toISOString(),
      category: 'policy',
      source: 'calendar-scaffold',
    },
  ];

  return {
    data: events,
    error: null,
  };
}
