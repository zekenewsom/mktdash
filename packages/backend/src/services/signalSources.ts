import { fetchMacroData } from './fredService';

const METRIC_SERIES = [
  'FEDFUNDS', 'CPIAUCSL', 'UNRATE',
  'DGS10', 'DGS2', 'T10Y2Y',
  'DTWEXBGS', 'DEXUSEU',
  'DCOILWTICO', 'GOLDAMGBD228NLBM',
  'VIXCLS', 'BAMLH0A0HYM2'
];

export async function fetchIntelligenceMetrics() {
  return fetchMacroData(METRIC_SERIES);
}
