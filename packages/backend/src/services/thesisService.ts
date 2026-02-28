import fs from 'fs';
import path from 'path';
import { buildSignalRegime } from './signalService';
import { fetchIntelligenceOverview } from './intelligenceService';

type ThesisItem = {
  id: string;
  name: string;
  narrative: string;
  probability: number;
  horizon: '1d' | '1w' | '1m';
  invalidations: string[];
  evidence_for: string[];
  evidence_against: string[];
};

type ThesisSnapshot = {
  as_of: string;
  base: ThesisItem;
  alternatives: ThesisItem[];
  confidence: string;
  drift_state?: string;
};

const history: ThesisSnapshot[] = [];
const HISTORY_MAX = 300;
const historyDir = path.resolve(process.cwd(), 'artifacts/thesis');
const historyFile = path.join(historyDir, 'history.jsonl');

function loadHistory() {
  try {
    if (!fs.existsSync(historyFile)) return;
    const lines = fs.readFileSync(historyFile, 'utf8').split('\n').filter(Boolean).slice(-HISTORY_MAX);
    for (const line of lines) {
      try {
        const row = JSON.parse(line);
        if (row?.as_of && row?.base) history.push(row);
      } catch {}
    }
  } catch {}
}

function appendHistory(snapshot: ThesisSnapshot) {
  fs.mkdirSync(historyDir, { recursive: true });
  fs.appendFileSync(historyFile, `${JSON.stringify(snapshot)}\n`, 'utf8');
}

loadHistory();

function normalizeProbs(items: ThesisItem[]) {
  const total = items.reduce((acc, i) => acc + i.probability, 0) || 1;
  return items.map((i) => ({ ...i, probability: Number(((i.probability / total) * 100).toFixed(1)) }));
}

function evidenceFromRegime(regime: any) {
  const forE: string[] = [];
  const againstE: string[] = [];

  for (const d of regime.top_5_contributors || []) {
    const line = `${d.label}: ${d.direction}/${d.impact}`;
    if (d.impact === 'positive') forE.push(line);
    else if (d.impact === 'negative') againstE.push(line);
  }

  if ((regime.drift?.state || '').toLowerCase() === 'red') {
    againstE.push('Drift state red: data quality degradation active');
  }

  return { forE, againstE };
}

export async function buildCurrentThesis() {
  const regimeResult = await buildSignalRegime();
  const overviewResult = await fetchIntelligenceOverview();

  const regime = regimeResult.data.regime;
  const drift = regimeResult.data.drift;
  const inv = overviewResult.data.invalidations || [];
  const { forE, againstE } = evidenceFromRegime(regimeResult.data);

  const priorBase = regime.label === 'risk_on' ? 58 : regime.label === 'risk_off' ? 28 : 45;
  const qualityAdj = drift?.state === 'red' ? -12 : drift?.state === 'yellow' ? -6 : 0;
  const convictionAdj = regime.score >= 60 || regime.score <= 40 ? 8 : 0;
  const baseProb = Math.max(15, Math.min(80, priorBase + qualityAdj + convictionAdj));

  const baseRaw: ThesisItem = {
    id: 'th-base',
    name: regime.label === 'risk_on' ? 'Risk continuation' : regime.label === 'risk_off' ? 'Defensive risk-off' : 'Mixed transition',
    narrative: `State ${regime.label} (score ${regime.score}) with drift=${drift?.state || 'unknown'}.`,
    probability: baseProb,
    horizon: '1w',
    invalidations: inv.map((x: any) => `${x.metric} ${x.threshold}`),
    evidence_for: forE,
    evidence_against: againstE,
  };

  const alt1: ThesisItem = {
    id: 'th-alt-1',
    name: 'Growth scare rebound in rates',
    narrative: 'Rates repricing drives risk rotation and elevates macro sensitivity.',
    probability: Math.max(10, 100 - baseProb - 20),
    horizon: '1w',
    invalidations: ['2Y yield fails breakout', 'Credit spreads tighten'],
    evidence_for: ['Rates volatility rising', 'Defensive leadership improving'],
    evidence_against: ['Equity breadth broadening'],
  };

  const alt2: ThesisItem = {
    id: 'th-alt-2',
    name: 'Policy shock repricing',
    narrative: 'Policy path shifts increase USD and volatility pressure.',
    probability: 20,
    horizon: '1m',
    invalidations: ['Fed communication softens', 'USD momentum fades'],
    evidence_for: ['Policy path uncertainty elevated'],
    evidence_against: ['Inflation impulse not accelerating'],
  };

  const normalized = normalizeProbs([baseRaw, alt1, alt2]);
  const [base, ...alts] = normalized.sort((a, b) => b.probability - a.probability);

  const snapshot: ThesisSnapshot = {
    as_of: new Date().toISOString(),
    base,
    alternatives: alts,
    confidence: regime.confidence,
    drift_state: drift?.state,
  };

  history.unshift(snapshot);
  if (history.length > HISTORY_MAX) history.splice(HISTORY_MAX);
  appendHistory(snapshot);

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
      persisted: fs.existsSync(historyFile),
      file: historyFile,
    },
    error: null,
  };
}
