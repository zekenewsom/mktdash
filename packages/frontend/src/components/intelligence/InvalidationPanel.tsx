import React from 'react';
import { InvalidationTrigger } from '../../contracts/intelligence';

interface Props {
  triggers: InvalidationTrigger[];
}

const tone: Record<InvalidationTrigger['status'], string> = {
  safe: 'text-green-700 bg-green-100',
  near: 'text-yellow-700 bg-yellow-100',
  triggered: 'text-red-700 bg-red-100',
};

const InvalidationPanel: React.FC<Props> = ({ triggers }) => {
  return (
    <section className="bg-card text-card-foreground rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold">Invalidation Triggers</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {triggers.slice(0, 5).map((t) => (
          <li key={t.id} className="border-b border-border pb-2 last:border-b-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">{t.label}</span>
              <span className={`px-2 py-0.5 rounded text-xs uppercase ${tone[t.status]}`}>{t.status}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t.metric} • threshold: {t.threshold} • sensitivity: {t.sensitivity}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default InvalidationPanel;
