import React from 'react';
import apiClient from '../../lib/apiClient';

type SleeveQuality = {
  sleeve: string;
  coverage: number;
  freshness: number;
  quality: number;
};

const QualityPanel: React.FC = () => {
  const [sleeves, setSleeves] = React.useState<SleeveQuality[]>([]);
  const [overall, setOverall] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLoading(true);
    apiClient.get('/api/intelligence/quality')
      .then((res) => {
        const payload = res.data?.data || {};
        setOverall(payload.overall_quality || 0);
        setSleeves(payload.sleeves || []);
      })
      .catch((err) => setError(err.message || 'Failed to load quality'))
      .finally(() => setLoading(false));
  }, []);

  const getColor = (q: number) => {
    if (q >= 80) return 'text-green-600';
    if (q >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <section className="bg-card text-card-foreground rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold">Sleeve Quality</h2>
      {loading && <p className="text-sm text-muted-foreground mt-2">Loading...</p>}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      <div className="mt-3 space-y-2">
        <div className="flex justify-between items-center border-b pb-2">
          <span className="font-medium">Overall</span>
          <span className={`text-lg font-bold ${getColor(overall)}`}>{overall}%</span>
        </div>

        {sleeves.map((s) => (
          <div key={s.sleeve} className="flex justify-between items-center text-sm">
            <span className="capitalize">{s.sleeve}</span>
            <div className="flex gap-3">
              <span className="text-muted-foreground">cov:{s.coverage}%</span>
              <span className="text-muted-foreground">fresh:{s.freshness}%</span>
              <span className={`font-medium ${getColor(s.quality)}`}>{s.quality}%</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default QualityPanel;
