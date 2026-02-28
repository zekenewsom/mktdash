import { buildSignalRegime } from './signalService';
import { fetchIntelligenceOverview } from './intelligenceService';

type ThesisItem = {
  id: string;
  name: string;
  narrative: string;
  probability: number;
  horizon: '1d' | '1w' | '1m';
  invalidations: string[];
};

type ThesisSnapshot = {
  as_of: string;
  base: ThesisItem;
  alternatives: ThesisItem[];
  confidence: string;
};

const history: ThesisSnapshot[] = [];

function normalizeProbs(items: ThesisItem[]) {
  const total = items.reduce((acc, i) => acc + i.probability, 0) || 1;
  return items.map((i) => ({ ...i, probability: Number(((i.probability / total) * 100).toFixed(1)) }));
}

export async function buildCurrentThesis() {
  const regimeResult = await buildSignalRegime();
  const overviewResult = await fetchIntelligenceOverview();

  const regime = regimeResult.data.regime;
  const inv = overviewResult.data.invalidations || [];

  const baseRaw: ThesisItem = {
    id: 'th-base',
    name: regime.label === 'risk_on' ? 'Risk continuation' : regime.label === 'risk_off' ? 'Defensive risk-off' : 'Mixed transition',
    narrative: `Current state ${regime.label} with score ${regime.score}. Monitor invalidations for fast thesis shift.`,
    probability: regime.score,
    horizon: '1w',
    invalidations: inv.map((x: any) => `${x.metric} ${x.threshold}`),
  };

  const alt1: ThesisItem = {
    id: 'th-alt-1',
    name: 'Growth scare rebound in rates',
    narrative: 'Rates repricing drives risk rotation and elevates macro sensitivity.',
    probability: 100 - regime.score,
    horizon: '1w',
    invalidations: ['2Y yield fails breakout', 'Credit spreads tighten'],
  };

  const alt2: ThesisItem = {
    id: 'th-alt-2',
    name: 'Policy shock repricing',
    narrative: 'Policy path shifts increase USD and volatility pressure.',
    probability: 30,
    horizon: '1m',
    invalidations: ['Fed communication softens', 'USD momentum fades'],
  };

  const normalized = normalizeProbs([baseRaw, alt1, alt2]);
  const [base, ...alts] = normalized.sort((a, b) => b.probability - a.probability);

  const snapshot: ThesisSnapshot = {
    as_of: new Date().toISOString(),
    base,
    alternatives: alts,
    confidence: regime.confidence,
  };

  history.unshift(snapshot);
  if (history.length > 100) history.splice(100);

  return {
    data: snapshot,
    error: regimeResult.error || overviewResult.error,
  };
}

export function getThesisHistory() {
  return {
    data: {
      count: history.length,
      items: history,
    },
    error: null,
  };
}
