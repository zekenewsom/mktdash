import React from 'react';
import apiClient from '../../lib/apiClient';
import { HeadlineItem } from '../../contracts/intelligence';

const HeadlineIntelligenceFeed: React.FC = () => {
  const [items, setItems] = React.useState<HeadlineItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLoading(true);
    setError(null);

    apiClient
      .get('/api/intelligence/headlines')
      .then((res) => {
        const payload = res.data?.data || [];
        const mapped = (payload || []).map((h: any) => ({
          id: h.id,
          title: h.title,
          url: h.url,
          sourceCount: h.source_count || 1,
          sources: h.sources || [],
          asOf: h.as_of || new Date().toISOString(),
          confidence: h.confidence || 'low',
        })) as HeadlineItem[];
        setItems(mapped);
      })
      .catch((err) => setError(err.message || 'Failed to load headlines'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-card text-card-foreground rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold">Headline Intelligence</h2>
      {loading && <p className="text-sm text-muted-foreground mt-2">Loading headline intelligence...</p>}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      {!loading && !error && items.length === 0 && <p className="text-sm text-muted-foreground mt-2">No headlines available.</p>}

      <ul className="mt-3 space-y-2 text-sm">
        {items.slice(0, 8).map((h) => (
          <li key={h.id} className="border-b border-border pb-2 last:border-b-0">
            <a href={h.url} target="_blank" rel="noreferrer" className="font-medium hover:underline">
              {h.title}
            </a>
            <p className="text-xs text-muted-foreground mt-1">
              sources: {h.sourceCount} ({h.sources.join(', ')}) • confidence: {h.confidence}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default HeadlineIntelligenceFeed;
