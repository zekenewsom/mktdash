/**
 * Overview Service - Provides snapshot data for HomePage
 */

import { fetchMacroData } from './fredService';
import { fetchIndexPerformance } from './marketDataService';

export interface SnapshotIndicatorItem {
  symbol: string;
  label: string;
  value: number | null;
  change?: number;
  unit?: string;
}

export interface GaugeData {
  value: number;
  name: string;
  rawValueDisplay?: string;
  unit?: string;
}

export interface SnapshotData {
  markets: SnapshotIndicatorItem[];
  economic: SnapshotIndicatorItem[];
  financialStability: SnapshotIndicatorItem[];
  marketGauge: GaugeData;
  economicGauge: GaugeData;
  stabilityGauge: GaugeData;
}

export async function fetchSnapshotData(): Promise<SnapshotData> {
  // Market indicators (use dedicated index service for accurate live index prints)
  const [indexResult, vixResult] = await Promise.all([
    fetchIndexPerformance(),
    fetchMacroData(['VIXCLS']),
  ]);

  const markets: SnapshotIndicatorItem[] = [
    {
      symbol: 'SP500',
      label: 'S&P 500',
      value: indexResult.data?.SP500?.value ?? null,
      change: indexResult.data?.SP500?.percentChange,
    },
    {
      symbol: 'DJIA',
      label: 'Dow Jones',
      value: indexResult.data?.DJIA?.value ?? null,
      change: indexResult.data?.DJIA?.percentChange,
    },
    {
      symbol: 'NASDAQCOM',
      label: 'Nasdaq',
      value: indexResult.data?.NASDAQCOM?.value ?? null,
      change: indexResult.data?.NASDAQCOM?.percentChange,
    },
    { symbol: 'VIXCLS', label: 'VIX', value: vixResult.data['VIXCLS']?.value ?? null },
  ];

  // Economic indicators
  const economicSymbols = ['FEDFUNDS', 'CPIAUCSL', 'UNRATE', 'PAYEMS'];
  const economicResult = await fetchMacroData(economicSymbols);
  
  const economic: SnapshotIndicatorItem[] = [
    { symbol: 'FEDFUNDS', label: 'Fed Funds', value: economicResult.data['FEDFUNDS']?.value ?? null, unit: '%' },
    { symbol: 'CPIAUCSL', label: 'CPI', value: economicResult.data['CPIAUCSL']?.value ?? null },
    { symbol: 'UNRATE', label: 'Unemployment', value: economicResult.data['UNRATE']?.value ?? null, unit: '%' },
    { symbol: 'PAYEMS', label: 'Payrolls', value: economicResult.data['PAYEMS']?.value ?? null, unit: 'M' },
  ];

  // Financial stability indicators
  const stabilitySymbols = ['BAMLH0A0HYM2', 'BAMLC0A0CM', 'T10Y2Y'];
  const stabilityResult = await fetchMacroData(stabilitySymbols);
  
  const financialStability: SnapshotIndicatorItem[] = [
    { symbol: 'BAMLH0A0HYM2', label: 'HY Spreads', value: stabilityResult.data['BAMLH0A0HYM2']?.value ?? null, unit: '%' },
    { symbol: 'BAMLC0A0CM', label: 'IG Spreads', value: stabilityResult.data['BAMLC0A0CM']?.value ?? null, unit: '%' },
    { symbol: 'T10Y2Y', label: '2s10s Curve', value: stabilityResult.data['T10Y2Y']?.value ?? null, unit: '%' },
  ];

  const marketChanges = markets
    .map((m) => (typeof m.change === 'number' ? m.change : 0))
    .slice(0, 3);
  const positiveCount = marketChanges.filter((c) => c > 0).length;
  const marketGauge = {
    value: Math.round((positiveCount / 3) * 100),
    name: 'Breadth',
    rawValueDisplay: `${positiveCount}/3 positive`,
    unit: '%',
  };

  const unrate = economic.find((e) => e.symbol === 'UNRATE')?.value ?? 0;
  const fed = economic.find((e) => e.symbol === 'FEDFUNDS')?.value ?? 0;
  const economicGauge = {
    value: Math.max(0, Math.min(100, Math.round((6 - Number(unrate)) * 16 + (6 - Number(fed)) * 4))),
    name: 'Macro Composite',
    rawValueDisplay: `UNRATE ${unrate}% | FED ${fed}%`,
    unit: '%',
  };

  const hy = financialStability.find((e) => e.symbol === 'BAMLH0A0HYM2')?.value ?? 0;
  const ig = financialStability.find((e) => e.symbol === 'BAMLC0A0CM')?.value ?? 0;
  const stabilityGauge = {
    value: Math.max(0, Math.min(100, Math.round(100 - (Number(hy) * 10 + Number(ig) * 20)))),
    name: 'Credit Stability',
    rawValueDisplay: `HY ${hy}% | IG ${ig}%`,
    unit: '%',
  };

  return { markets, economic, financialStability, marketGauge, economicGauge, stabilityGauge };
}
