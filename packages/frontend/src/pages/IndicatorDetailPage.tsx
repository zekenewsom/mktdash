import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import apiClient from '../lib/apiClient';
import ChartContainer from '../components/placeholders/ChartContainer';

const IndicatorDetailPage: React.FC = () => {
  const { id = '' } = useParams();
  const location = useLocation();
  const type = location.pathname.startsWith('/crypto/') ? 'crypto' : 'series';
  const [data, setData] = React.useState<{ date: string; value: number }[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    if (type === 'crypto') {
      apiClient.get('/api/data/phase3')
        .then((res) => {
          const row = res.data?.data?.yfinance?.[id.toUpperCase()];
          if (!row?.value) {
            setData([]);
          } else {
            setData([{ date: row.as_of || new Date().toISOString().slice(0, 10), value: row.value }]);
          }
        })
        .catch((e) => setError(e.message || 'Failed to load crypto data'))
        .finally(() => setLoading(false));
      return;
    }

    apiClient.get(`/api/history?series=${encodeURIComponent(id)}`)
      .then(async (res) => {
        let rows = (res.data?.data || []).map((r: any) => ({
          date: r.date || r.as_of,
          value: Number(r.value),
        })).filter((r: any) => r.date && !Number.isNaN(r.value));

        // If history is empty, attempt a unified snapshot fallback so clicks always resolve to data.
        if (rows.length === 0) {
          try {
            const u = await apiClient.post('/api/data/unified', {
              fred: [id.toUpperCase()],
              yfinance: [id.toUpperCase()],
            });
            const fredRow = u.data?.data?.fred?.[id.toUpperCase()];
            const yfRow = u.data?.data?.yfinance?.[id.toUpperCase()];
            const row = fredRow || yfRow;
            if (row?.value != null) {
              rows = [{ date: row.as_of || new Date().toISOString().slice(0, 10), value: Number(row.value) }];
            }
          } catch {
            // keep empty
          }
        }

        setData(rows);
        if (res.data?.error?.message && rows.length === 0) {
          setError(`Degraded source: ${res.data.error.message}`);
        } else if (rows.length > 0) {
          setError(null);
        }
      })
      .catch((e) => setError(e.message || 'Failed to load series history'))
      .finally(() => setLoading(false));
  }, [id, type]);

  return (
    <div className="space-y-4">
      <div>
        <Link to={type === 'crypto' ? '/markets' : '/economic'} className="text-sm text-primary hover:underline">← Back</Link>
        <h1 className="text-2xl font-semibold mt-1">{id} {type === 'crypto' ? 'Crypto' : 'Series'} Detail</h1>
        {error && <p className="text-xs text-amber-600 mt-1">{error}</p>}
      </div>

      <ChartContainer
        data={data}
        loading={loading}
        error={loading ? null : (data.length === 0 ? 'No historical data available' : null)}
        indexName={id.toUpperCase()}
      />
    </div>
  );
};

export default IndicatorDetailPage;
