import { MaterialChange, RegimeState } from '../contracts/intelligence';

export const fixtureRegimeState: RegimeState = {
  state: 'neutral',
  score: 52,
  confidence: 'medium',
  drivers: [
    { key: 'yields', label: 'UST 10Y yield', direction: 'up', impact: 'negative' },
    { key: 'dxy', label: 'DXY', direction: 'up', impact: 'negative' },
    { key: 'credit', label: 'HY spreads', direction: 'flat', impact: 'neutral' },
  ],
  quality: {
    confidence: 'medium',
    asOf: new Date().toISOString(),
    source: 'fixture',
    isFallback: false,
    freshnessMinutes: 10,
    qualityFlags: ['pre-integration'],
  },
};

export const fixtureMaterialChanges: MaterialChange[] = [
  {
    id: 'chg-1',
    title: 'Treasury yields grinding higher',
    detail: '10Y yield moved higher through the prior session range.',
    category: 'liquidity',
    direction: 'bearish',
    asOf: new Date().toISOString(),
    confidence: 'medium',
  },
  {
    id: 'chg-2',
    title: 'Dollar strength broadening',
    detail: 'DXY bid is extending across majors, tightening global conditions.',
    category: 'risk',
    direction: 'bearish',
    asOf: new Date().toISOString(),
    confidence: 'high',
  },
  {
    id: 'chg-3',
    title: 'Equities holding despite macro pressure',
    detail: 'Index resilience is creating a cross-asset divergence signal.',
    category: 'growth',
    direction: 'neutral',
    asOf: new Date().toISOString(),
    confidence: 'low',
  },
];
