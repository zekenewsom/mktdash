import React from 'react';
import apiClient from '../../lib/apiClient';

type Metric = { symbol: string; value: number | null; as_of: string | null; source: string; unit: string };

const ORDER = [
  'DGS2','DGS5','DGS10','DGS30','T10Y2Y','T5YIE','DFII10',
  'DTWEXBGS','DEXUSEU','DEXJPUS','DEXUSUK',
  'VIXCLS','BAMLH0A0HYM2','BAMLC0A0CM',
  'DCOILWTICO','DCOILBRENTEU','GOLDAMGBD228NLBM','PCOPPUSDM',
  'FEDFUNDS','DFF','SOFR','CPIAUCSL','CPILFESL','PCEPI','PCEPILFE','UNRATE','PAYEMS','ICSA','INDPRO','RSAFS'
];

const LABELS: Record<string, string> = {
  DGS2:'US 2Y', DGS5:'US 5Y', DGS10:'US 10Y', DGS30:'US 30Y', T10Y2Y:'2s10s', T5YIE:'5Y BE', DFII10:'10Y Real Yield',
  DTWEXBGS:'Dollar Index', DEXUSEU:'EURUSD', DEXJPUS:'USDJPY', DEXUSUK:'GBPUSD',
  VIXCLS:'VIX', BAMLH0A0HYM2:'HY OAS', BAMLC0A0CM:'IG OAS',
  DCOILWTICO:'WTI Crude', DCOILBRENTEU:'Brent', GOLDAMGBD228NLBM:'Gold', PCOPPUSDM:'Copper',
  FEDFUNDS:'Fed Funds', DFF:'Fed Funds Eff', SOFR:'SOFR', CPIAUCSL:'CPI', CPILFESL:'Core CPI', PCEPI:'PCE', PCEPILFE:'Core PCE',
  UNRATE:'Unemployment', PAYEMS:'NFP Payrolls', ICSA:'Jobless Claims', INDPRO:'Industrial Prod', RSAFS:'Retail Sales'
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
      <h2 className="text-xl font-semibold">Market Metrics ({ORDER.length})</h2>
      {loading && <p className="text-sm text-muted-foreground mt-2">Loading metrics...</p>}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      <div className="mt-3 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 text-sm">
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
