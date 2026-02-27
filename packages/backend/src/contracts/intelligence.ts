import { QualityFlags } from './marketData';

export type ConfidenceLevel = 'high' | 'medium' | 'low';
export type RegimeStateName = 'risk_on' | 'neutral' | 'risk_off';

export interface IntelligenceQuality {
  as_of: string;
  source: string;
  confidence: ConfidenceLevel;
  quality_flags?: QualityFlags;
}

export interface RegimeDriver {
  key: string;
  label: string;
  direction: 'up' | 'down' | 'flat';
  impact: 'positive' | 'negative' | 'neutral';
}

export interface RegimeState {
  state: RegimeStateName;
  score: number;
  confidence: ConfidenceLevel;
  drivers: RegimeDriver[];
  quality: IntelligenceQuality;
}

export interface MaterialChange {
  id: string;
  title: string;
  detail: string;
  category: 'growth' | 'inflation' | 'liquidity' | 'risk' | 'policy' | 'other';
  direction: 'bullish' | 'bearish' | 'neutral';
  magnitude?: number;
  as_of: string;
  confidence: ConfidenceLevel;
  source: string;
  quality_flags?: QualityFlags;
}

export interface IntelligenceOverview {
  regime: RegimeState;
  changes: MaterialChange[];
  quality: {
    as_of: string;
    confidence: ConfidenceLevel;
    fallback_used: boolean;
    stale_used: boolean;
    stale_count: number;
    sources: string[];
  };
}
