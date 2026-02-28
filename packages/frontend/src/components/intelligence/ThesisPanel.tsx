import React from 'react';
import apiClient from '../../lib/apiClient';

type ThesisItem = {
  id: string;
  name: string;
  narrative: string;
  probability: number;
  invalidations: string[];
  evidence_for?: string[];
  evidence_against?: string[];
};

const ThesisPanel: React.FC = () => {
  const [base, setBase] = React.useState<ThesisItem | null>(null);
  const [alts, setAlts] = React.useState<ThesisItem[]>([]);
  const [driftState, setDriftState] = React.useState<string>('unknown');
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
        setDriftState(payload.drift_state || 'unknown');
      })
      .catch((err) => setError(err.message || 'Failed to load thesis'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-card text-card-foreground rounded-lg shadow p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Dynamic Thesis</h2>
        <span className="text-xs text-muted-foreground">drift: {driftState}</span>
      </div>
      {loading && <p className="text-sm text-muted-foreground mt-2">Loading thesis...</p>}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      {base && (
        <div className="mt-3 border border-border rounded p-3">
          <p className="text-xs text-muted-foreground">Base case ({base.probability}%)</p>
          <p className="font-semibold">{base.name}</p>
          <p className="text-sm mt-1 text-muted-foreground">{base.narrative}</p>

          {base.evidence_for?.length ? (
            <div className="mt-2">
              <p className="text-xs font-medium">Evidence For</p>
              <ul className="text-xs text-muted-foreground list-disc ml-4">
                {base.evidence_for.slice(0, 3).map((e, i) => <li key={`for-${i}`}>{e}</li>)}
              </ul>
            </div>
          ) : null}

          {base.evidence_against?.length ? (
            <div className="mt-2">
              <p className="text-xs font-medium">Evidence Against</p>
              <ul className="text-xs text-muted-foreground list-disc ml-4">
                {base.evidence_against.slice(0, 3).map((e, i) => <li key={`against-${i}`}>{e}</li>)}
              </ul>
            </div>
          ) : null}
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
