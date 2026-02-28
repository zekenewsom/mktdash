import { FeatureSpec } from '../contracts/features';

export const FEATURE_REGISTRY: FeatureSpec[] = [
  // Rates
  { feature_id: 'UST2Y', symbol: 'DGS2', sleeve: 'rates', label: 'US 2Y', weight_base: 0.05, target_freq: '1d', sla_minutes: 1440 },
  { feature_id: 'UST5Y', symbol: 'DGS5', sleeve: 'rates', label: 'US 5Y', weight_base: 0.04, target_freq: '1d', sla_minutes: 1440 },
  { feature_id: 'UST10Y', symbol: 'DGS10', sleeve: 'rates', label: 'US 10Y', weight_base: 0.06, target_freq: '1d', sla_minutes: 1440 },
  { feature_id: 'UST30Y', symbol: 'DGS30', sleeve: 'rates', label: 'US 30Y', weight_base: 0.03, target_freq: '1d', sla_minutes: 1440 },
  { feature_id: 'CURVE_2S10S', symbol: 'T10Y2Y', sleeve: 'rates', label: '2s10s', weight_base: 0.05, target_freq: '1d', sla_minutes: 1440 },
  { feature_id: 'BE_5Y', symbol: 'T5YIE', sleeve: 'rates', label: '5Y Breakeven', weight_base: 0.03, target_freq: '1d', sla_minutes: 1440 },
  { feature_id: 'REAL_10Y', symbol: 'DFII10', sleeve: 'rates', label: '10Y Real Yield', weight_base: 0.03, target_freq: '1d', sla_minutes: 1440 },

  // FX
  { feature_id: 'DXY', symbol: 'DTWEXBGS', sleeve: 'fx', label: 'Dollar Index', weight_base: 0.05, target_freq: '1d', sla_minutes: 1440 },
  { feature_id: 'EURUSD', symbol: 'DEXUSEU', sleeve: 'fx', label: 'EURUSD', weight_base: 0.03, target_freq: '1d', sla_minutes: 1440 },
  { feature_id: 'USDJPY', symbol: 'DEXJPUS', sleeve: 'fx', label: 'USDJPY', weight_base: 0.03, target_freq: '1d', sla_minutes: 1440 },
  { feature_id: 'GBPUSD', symbol: 'DEXUSUK', sleeve: 'fx', label: 'GBPUSD', weight_base: 0.03, target_freq: '1d', sla_minutes: 1440 },

  // Credit / vol
  { feature_id: 'HY_OAS', symbol: 'BAMLH0A0HYM2', sleeve: 'credit', label: 'HY OAS', weight_base: 0.06, target_freq: '1d', sla_minutes: 1440 },
  { feature_id: 'IG_OAS', symbol: 'BAMLC0A0CM', sleeve: 'credit', label: 'IG OAS', weight_base: 0.05, target_freq: '1d', sla_minutes: 1440 },
  { feature_id: 'VIX', symbol: 'VIXCLS', sleeve: 'volatility', label: 'VIX', weight_base: 0.05, target_freq: '1d', sla_minutes: 1440 },

  // Commodities
  { feature_id: 'WTI', symbol: 'DCOILWTICO', sleeve: 'commodities', label: 'WTI', weight_base: 0.04, target_freq: '1d', sla_minutes: 1440 },
  { feature_id: 'BRENT', symbol: 'DCOILBRENTEU', sleeve: 'commodities', label: 'Brent', weight_base: 0.03, target_freq: '1d', sla_minutes: 1440 },
  { feature_id: 'GOLD', symbol: 'GOLDAMGBD228NLBM', sleeve: 'commodities', label: 'Gold', weight_base: 0.04, target_freq: '1d', sla_minutes: 1440 },
  { feature_id: 'COPPER', symbol: 'PCOPPUSDM', sleeve: 'commodities', label: 'Copper', weight_base: 0.03, target_freq: '1d', sla_minutes: 1440 },

  // Macro / policy
  { feature_id: 'FEDFUNDS', symbol: 'FEDFUNDS', sleeve: 'macro', label: 'Fed Funds', weight_base: 0.04, target_freq: '1mo', sla_minutes: 43200 },
  { feature_id: 'DFF', symbol: 'DFF', sleeve: 'macro', label: 'Fed Funds Effective', weight_base: 0.03, target_freq: '1d', sla_minutes: 1440 },
  { feature_id: 'SOFR', symbol: 'SOFR', sleeve: 'macro', label: 'SOFR', weight_base: 0.02, target_freq: '1d', sla_minutes: 1440 },
  { feature_id: 'CPI', symbol: 'CPIAUCSL', sleeve: 'macro', label: 'CPI', weight_base: 0.03, target_freq: '1mo', sla_minutes: 43200 },
  { feature_id: 'CORE_CPI', symbol: 'CPILFESL', sleeve: 'macro', label: 'Core CPI', weight_base: 0.03, target_freq: '1mo', sla_minutes: 43200 },
  { feature_id: 'PCE', symbol: 'PCEPI', sleeve: 'macro', label: 'PCE', weight_base: 0.03, target_freq: '1mo', sla_minutes: 43200 },
  { feature_id: 'CORE_PCE', symbol: 'PCEPILFE', sleeve: 'macro', label: 'Core PCE', weight_base: 0.03, target_freq: '1mo', sla_minutes: 43200 },
  { feature_id: 'UNRATE', symbol: 'UNRATE', sleeve: 'macro', label: 'Unemployment', weight_base: 0.03, target_freq: '1mo', sla_minutes: 43200 },
  { feature_id: 'PAYROLLS', symbol: 'PAYEMS', sleeve: 'macro', label: 'Payrolls', weight_base: 0.03, target_freq: '1mo', sla_minutes: 43200 },
  { feature_id: 'CLAIMS', symbol: 'ICSA', sleeve: 'macro', label: 'Initial Claims', weight_base: 0.02, target_freq: '1w', sla_minutes: 10080 },
  { feature_id: 'INDPRO', symbol: 'INDPRO', sleeve: 'macro', label: 'Industrial Production', weight_base: 0.02, target_freq: '1mo', sla_minutes: 43200 },
  { feature_id: 'RETAIL', symbol: 'RSAFS', sleeve: 'macro', label: 'Retail Sales', weight_base: 0.02, target_freq: '1mo', sla_minutes: 43200 },
];
