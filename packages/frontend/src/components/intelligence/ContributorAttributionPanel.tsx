import React from 'react';
import apiClient from '../../lib/apiClient';

type Contributor = { key: string; label: string; impact: string; weight?: number; direction: string };

const ContributorAttributionPanel: React.FC = () => {
  const [items, setItems] = React.useState<Contributor[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    apiClient
      .get('/api/signals/regime')
      .then((res) => {
        const contributors = res.data?.data?.regime?.top_5_contributors || [];
        setItems(contributors);
      })
      .catch((err) => setError(err.message || 'Failed to load contributors'));
  }, []);

  return (
    <section className="bg-card text-card-foreground rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold">Score Attribution</h2>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((c) => (
          <li key={c.key} className="border-b border-border pb-1 last:border-b-0">
            <div className="flex justify-between">
              <span>{c.label}</span>
              <span className="text-xs text-muted-foreground">w: {c.weight ?? 0}</span>
            </div>
            <p className="text-xs text-muted-foreground">{c.direction} / {c.impact}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ContributorAttributionPanel;
