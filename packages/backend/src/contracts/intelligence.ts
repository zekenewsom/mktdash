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
  weight?: number;
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

export interface InvalidationTrigger {
  id: string;
  label: string;
  metric: string;
  threshold: string;
  status: 'safe' | 'near' | 'triggered';
  sensitivity: 'low' | 'medium' | 'high';
  as_of: string;
  confidence: ConfidenceLevel;
}

export interface HeadlineItem {
  id: string;
  title: string;
  url: string;
  source_count: number;
  sources: string[];
  as_of: string;
  confidence: ConfidenceLevel;
}

export interface IntelligenceOverview {
  regime: RegimeState;
  changes: MaterialChange[];
  invalidations: InvalidationTrigger[];
  quality: {
    as_of: string;
    confidence: ConfidenceLevel;
    fallback_used: boolean;
    stale_used: boolean;
    stale_count: number;
    sources: string[];
  };
}
