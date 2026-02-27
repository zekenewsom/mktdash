import React from 'react';
import { MaterialChange } from '../../contracts/intelligence';

interface WhatChangedPanelProps {
  changes: MaterialChange[];
}

const directionTone: Record<MaterialChange['direction'], string> = {
  bullish: 'text-positive',
  bearish: 'text-negative',
  neutral: 'text-muted-foreground',
};

const WhatChangedPanel: React.FC<WhatChangedPanelProps> = ({ changes }) => {
  return (
    <section className="bg-card text-card-foreground rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold">What Changed Today</h2>
      <ul className="mt-3 space-y-3 text-sm">
        {changes.slice(0, 3).map((item) => (
          <li key={item.id} className="border-b border-border pb-2 last:border-b-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium">{item.title}</p>
              <span className={`text-xs uppercase ${directionTone[item.direction]}`}>{item.direction}</span>
            </div>
            <p className="text-muted-foreground mt-1">{item.detail}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {item.category} • confidence: {item.confidence} • as_of: {new Date(item.asOf).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default WhatChangedPanel;
