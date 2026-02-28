import React from 'react';
import apiClient from '../../lib/apiClient';

type ThesisItem = { id: string; name: string; narrative: string; probability: number; invalidations: string[] };

const ThesisPanel: React.FC = () => {
  const [base, setBase] = React.useState<ThesisItem | null>(null);
  const [alts, setAlts] = React.useState<ThesisItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLoading(true);
    apiClient
      .get('/api/thesis/current')
      .then((res) => {
        const payload = res.data?.data || {};
        setBase(payload.base || null);
        setAlts(payload.alternatives || []);
      })
      .catch((err) => setError(err.message || 'Failed to load thesis'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-card text-card-foreground rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold">Dynamic Thesis</h2>
      {loading && <p className="text-sm text-muted-foreground mt-2">Loading thesis...</p>}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      {base && (
        <div className="mt-3 border border-border rounded p-3">
          <p className="text-xs text-muted-foreground">Base case ({base.probability}%)</p>
          <p className="font-semibold">{base.name}</p>
          <p className="text-sm mt-1 text-muted-foreground">{base.narrative}</p>
        </div>
      )}

      {alts.length > 0 && (
        <div className="mt-3 space-y-2">
          {alts.slice(0, 2).map((a) => (
            <div key={a.id} className="border border-border rounded p-2">
              <p className="text-xs text-muted-foreground">Alternative ({a.probability}%)</p>
              <p className="text-sm font-medium">{a.name}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ThesisPanel;
