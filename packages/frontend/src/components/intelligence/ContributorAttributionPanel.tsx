import React from 'react';
import apiClient from '../../lib/apiClient';

type Contributor = { key: string; label: string; impact: string; weight?: number; direction: string };
type SleeveStrength = Record<string, number>;

const ContributorAttributionPanel: React.FC = () => {
  const [items, setItems] = React.useState<Contributor[]>([]);
  const [sleeveStrength, setSleeveStrength] = React.useState<SleeveStrength>({});
  const [featureCount, setFeatureCount] = React.useState(0);
  const [confidence, setConfidence] = React.useState<string>('unknown');
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    apiClient
      .get('/api/signals/regime')
      .then((res) => {
        const regime = res.data?.data?.regime || {};
        setItems(regime.top_5_contributors || []);
        setSleeveStrength(regime.sleeve_strength || {});
        setFeatureCount(regime.feature_count || 0);
        setConfidence(regime.confidence || 'unknown');
      })
      .catch((err) => setError(err.message || 'Failed to load contributors'));
  }, []);

  // Calculate total sleeve weight
  const totalWeight = Object.values(sleeveStrength).reduce((a, b) => a + b, 0);

  // Format sleeve name for display
  const formatSleeve = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  // Get sleeve color
  const getSleeveColor = (s: string) => {
    const colors: Record<string, string> = {
      rates: 'bg-blue-500',
      fx: 'bg-green-500',
      credit: 'bg-purple-500',
      volatility: 'bg-red-500',
      commodities: 'bg-yellow-500',
      macro: 'bg-orange-500',
      equities: 'bg-indigo-500',
    };
    return colors[s] || 'bg-gray-500';
  };

  return (
    <section className="bg-card text-card-foreground rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Score Attribution</h2>
        <span className="text-xs px-2 py-1 bg-muted rounded">
          {confidence} confidence
        </span>
      </div>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      {/* Sleeve Strength Section */}
      {Object.keys(sleeveStrength).length > 0 && (
        <div className="mt-3 p-3 bg-muted rounded-lg">
          <div className="text-xs text-muted-foreground mb-2">
            Sleeve Weights ({featureCount} features)
          </div>
          <div className="space-y-2">
            {Object.entries(sleeveStrength)
              .sort(([, a], [, b]) => b - a)
              .map(([sleeve, weight]) => {
                const pct = totalWeight > 0 ? (weight / totalWeight) * 100 : 0;
                return (
                  <div key={sleeve} className="flex items-center gap-2">
                    <span className="text-xs w-20 capitalize">{formatSleeve(sleeve)}</span>
                    <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getSleeveColor(sleeve)}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs w-12 text-right">{pct.toFixed(1)}%</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Top Contributors */}
      <div className="mt-3">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Top Contributors</h3>
        {items.length > 0 ? (
          <ul className="space-y-2 text-sm">
            {items.map((c, i) => (
              <li key={c.key || i} className="border-b border-border pb-2 last:border-b-0">
                <div className="flex justify-between items-start">
                  <span className="font-medium">{c.label || c.key}</span>
                  <span className="text-xs text-muted-foreground">
                    w: {(c.weight ?? 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-2 mt-1">
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    c.direction === 'up' ? 'bg-green-100 text-green-700' :
                    c.direction === 'down' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {c.direction || '—'}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    c.impact === 'positive' ? 'bg-green-100 text-green-700' :
                    c.impact === 'negative' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {c.impact || '—'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No contributor data</p>
        )}
      </div>
    </section>
  );
};

export default ContributorAttributionPanel;
