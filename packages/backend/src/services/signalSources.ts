import { fetchMacroData } from './fredService';

const METRIC_SERIES = [
  // Policy + macro
  'FEDFUNDS', 'DFF', 'SOFR',
  'CPIAUCSL', 'CPILFESL', 'PCEPI', 'PCEPILFE',
  'UNRATE', 'PAYEMS', 'ICSA', 'INDPRO', 'RSAFS',

  // Rates
  'DGS2', 'DGS5', 'DGS10', 'DGS30', 'T10Y2Y', 'T5YIE', 'DFII10',

  // FX
  'DTWEXBGS', 'DEXUSEU', 'DEXJPUS', 'DEXUSUK',

  // Commodities
  'DCOILWTICO', 'DCOILBRENTEU', 'GOLDAMGBD228NLBM', 'PCOPPUSDM',

  // Vol + credit
  'VIXCLS', 'BAMLH0A0HYM2', 'BAMLC0A0CM',
] as const;

export async function fetchIntelligenceMetrics() {
  return fetchMacroData([...METRIC_SERIES]);
}

export function getMetricUniverse() {
  return [...METRIC_SERIES];
}
