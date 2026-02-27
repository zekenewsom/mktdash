import React from 'react';
import { RegimeState } from '../../contracts/intelligence';

interface RegimeStateCardProps {
  regime: RegimeState;
}

const stateColor: Record<RegimeState['state'], string> = {
  risk_on: 'text-positive',
  neutral: 'text-muted-foreground',
  risk_off: 'text-negative',
};

const RegimeStateCard: React.FC<RegimeStateCardProps> = ({ regime }) => {
  return (
    <section className="bg-card text-card-foreground rounded-lg shadow p-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">Regime State</h2>
          <p className={`text-sm mt-1 uppercase tracking-wide ${stateColor[regime.state]}`}>
            {regime.state.replace('_', ' ')}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Score</p>
          <p className="text-lg font-semibold">{regime.score}</p>
        </div>
      </div>

      <div className="mt-3 text-sm text-muted-foreground">
        Confidence: <span className="font-medium text-foreground capitalize">{regime.confidence}</span>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        {regime.drivers.slice(0, 3).map((driver) => (
          <div key={driver.key} className="flex items-center justify-between border-b border-border pb-1 last:border-b-0">
            <span>{driver.label}</span>
            <span className="text-muted-foreground">
              {driver.direction === 'up' ? '↑' : driver.direction === 'down' ? '↓' : '→'}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        as_of: {new Date(regime.quality.asOf).toLocaleString()}
      </p>
    </section>
  );
};

export default RegimeStateCard;
