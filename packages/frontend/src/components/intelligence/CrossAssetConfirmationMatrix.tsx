import React from 'react';

type SignalDirection = 'up' | 'down' | 'flat';
type ConfirmationState = 'confirm' | 'diverge' | 'neutral';

interface CrossAssetRow {
  asset: string;
  signal: SignalDirection;
  confirmation: ConfirmationState;
  note: string;
}

const rows: CrossAssetRow[] = [
  { asset: 'Equities (SPX/NQ)', signal: 'up', confirmation: 'neutral', note: 'Awaiting live matrix wiring' },
  { asset: 'Rates (UST 10Y)', signal: 'up', confirmation: 'diverge', note: 'Higher yields can pressure risk assets' },
  { asset: 'USD (DXY)', signal: 'up', confirmation: 'diverge', note: 'Dollar strength tightens conditions' },
  { asset: 'Credit (HY spreads)', signal: 'flat', confirmation: 'neutral', note: 'No strong confirmation yet' },
  { asset: 'Volatility (VIX/MOVE)', signal: 'flat', confirmation: 'neutral', note: 'Regime stress not elevated' },
  { asset: 'Commodities (WTI/Gold)', signal: 'flat', confirmation: 'neutral', note: 'Mixed commodity picture' },
];

const signalIcon: Record<SignalDirection, string> = {
  up: '↑',
  down: '↓',
  flat: '→',
};

const confirmationTone: Record<ConfirmationState, string> = {
  confirm: 'text-positive',
  diverge: 'text-negative',
  neutral: 'text-muted-foreground',
};

const CrossAssetConfirmationMatrix: React.FC = () => {
  return (
    <section className="bg-card text-card-foreground rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold">Cross-Asset Confirmation Matrix</h2>
      <p className="text-sm text-muted-foreground mt-1">Checks whether asset buckets confirm or diverge from the current regime call.</p>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground border-b border-border">
              <th className="py-2 pr-2">Asset Bucket</th>
              <th className="py-2 pr-2">Signal</th>
              <th className="py-2 pr-2">State</th>
              <th className="py-2">Note</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.asset} className="border-b border-border last:border-b-0">
                <td className="py-2 pr-2 font-medium">{row.asset}</td>
                <td className="py-2 pr-2">{signalIcon[row.signal]}</td>
                <td className={`py-2 pr-2 capitalize ${confirmationTone[row.confirmation]}`}>{row.confirmation}</td>
                <td className="py-2 text-muted-foreground">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CrossAssetConfirmationMatrix;
