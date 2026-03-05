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

export interface SnapshotData {
  markets: SnapshotIndicatorItem[];
  economic: SnapshotIndicatorItem[];
  financialStability: SnapshotIndicatorItem[];
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

  return { markets, economic, financialStability };
}
