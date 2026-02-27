import React from 'react';
import apiClient from '../../lib/apiClient';

interface QualityRecord {
  symbol: string;
  source: string;
  as_of: string | null;
  age_mins: number | null;
  stale: boolean;
  fallback: boolean;
}

interface QualityPayload {
  totals: {
    metrics: number;
    stale_count: number;
    fallback_count: number;
  };
  records: QualityRecord[];
}

const DataQualityConsole: React.FC = () => {
  const [data, setData] = React.useState<QualityPayload | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLoading(true);
    setError(null);

    apiClient
      .get('/api/health/data-quality')
      .then((res) => {
        const payload = res.data?.data || res.data;
        setData(payload);
      })
      .catch((err) => setError(err.message || 'Failed to load data quality'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-card text-card-foreground rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold">Data Quality Console</h2>

      {loading && <p className="text-sm text-muted-foreground mt-2">Loading quality telemetry...</p>}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      {data && (
        <>
          <div className="mt-3 text-sm text-muted-foreground flex flex-wrap gap-3">
            <span>metrics: <strong className="text-foreground">{data.totals.metrics}</strong></span>
            <span>stale: <strong className="text-foreground">{data.totals.stale_count}</strong></span>
            <span>fallback: <strong className="text-foreground">{data.totals.fallback_count}</strong></span>
          </div>

          <ul className="mt-3 space-y-2 text-sm">
            {data.records.slice(0, 6).map((r) => (
              <li key={r.symbol} className="border-b border-border pb-1 last:border-b-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{r.symbol}</span>
                  <span className="text-xs text-muted-foreground">{r.source}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  age: {r.age_mins ?? 'n/a'}m • {r.stale ? 'stale' : 'fresh'} • {r.fallback ? 'fallback' : 'primary'}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
};

export default DataQualityConsole;
