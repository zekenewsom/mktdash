import React from 'react';
import apiClient from '../../lib/apiClient';

type Metric = { symbol: string; value: number | null; as_of: string | null; source: string; unit: string };

const ORDER = ['DGS10','DGS2','T10Y2Y','VIXCLS','DTWEXBGS','DEXUSEU','DCOILWTICO','GOLDAMGBD228NLBM','BAMLH0A0HYM2','FEDFUNDS','CPIAUCSL','UNRATE'];

const LABELS: Record<string, string> = {
  DGS10:'US 10Y', DGS2:'US 2Y', T10Y2Y:'2s10s', VIXCLS:'VIX', DTWEXBGS:'Dollar Index', DEXUSEU:'EURUSD',
  DCOILWTICO:'WTI Crude', GOLDAMGBD228NLBM:'Gold', BAMLH0A0HYM2:'HY OAS', FEDFUNDS:'Fed Funds', CPIAUCSL:'CPI', UNRATE:'Unemployment'
};

const MarketMetricsPanel: React.FC = () => {
  const [metrics, setMetrics] = React.useState<Record<string, Metric>>({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLoading(true);
    apiClient.get('/api/intelligence/metrics')
      .then((res) => setMetrics(res.data?.data || {}))
      .catch((err) => setError(err.message || 'Failed to load metrics'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-card text-card-foreground rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold">Market Metrics (12)</h2>
      {loading && <p className="text-sm text-muted-foreground mt-2">Loading metrics...</p>}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      <div className="mt-3 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 text-sm">
        {ORDER.map((key) => {
          const m = metrics[key];
          return (
            <div key={key} className="border border-border rounded p-2">
              <p className="text-xs text-muted-foreground">{LABELS[key] || key}</p>
              <p className="font-semibold">{m?.value != null ? m.value.toFixed(2) : 'N/A'}</p>
              <p className="text-[10px] text-muted-foreground">{m?.as_of || 'n/a'}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default MarketMetricsPanel;
