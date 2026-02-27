import React from 'react';
import axios from 'axios';

interface CalendarEvent {
  id: string;
  title: string;
  country: string;
  impact: 'high' | 'medium' | 'low';
  scheduled_at: string;
  category: string;
  source: string;
}

const EconomicCalendar: React.FC = () => {
  const [events, setEvents] = React.useState<CalendarEvent[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get('/api/calendar/events')
      .then((res) => {
        const payload = res.data?.data || res.data;
        setEvents(payload || []);
      })
      .catch((err) => setError(err.message || 'Failed to load economic calendar'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-card text-card-foreground rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold">Economic Calendar (7-day)</h2>

      {loading && <p className="text-sm text-muted-foreground mt-2">Loading calendar...</p>}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      <ul className="mt-3 space-y-2 text-sm">
        {events.map((event) => (
          <li key={event.id} className="border-b border-border pb-2 last:border-b-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">{event.title}</span>
              <span className="text-xs uppercase text-muted-foreground">{event.impact}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {event.country} • {event.category} • {new Date(event.scheduled_at).toLocaleString()} • {event.source}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default EconomicCalendar;
