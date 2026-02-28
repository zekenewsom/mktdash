export type Sleeve = 'equities' | 'rates' | 'fx' | 'credit' | 'volatility' | 'commodities' | 'macro';

export interface FeatureSpec {
  feature_id: string;
  symbol: string;
  sleeve: Sleeve;
  label: string;
  weight_base: number;
  target_freq: '1d' | '1h' | '1w' | '1mo';
  sla_minutes: number;
}

export interface FeatureSnapshot {
  feature_id: string;
  symbol: string;
  sleeve: Sleeve;
  label: string;
  value: number | null;
  as_of: string | null;
  source: string;
  stale: boolean;
  fallback: boolean;
  weight_base: number;
  effective_weight: number;
}
