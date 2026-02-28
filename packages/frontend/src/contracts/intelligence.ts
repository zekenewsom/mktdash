export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type RegimeStateName = 'risk_on' | 'neutral' | 'risk_off';

export interface QualityBadge {
  confidence: ConfidenceLevel;
  asOf: string;
  source: string;
  isFallback: boolean;
  freshnessMinutes?: number;
  qualityFlags?: string[];
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
  quality: QualityBadge;
}

export interface MaterialChange {
  id: string;
  title: string;
  detail: string;
  category: 'growth' | 'inflation' | 'liquidity' | 'risk' | 'policy' | 'other';
  direction: 'bullish' | 'bearish' | 'neutral';
  magnitude?: number;
  asOf: string;
  confidence: ConfidenceLevel;
}

export interface InvalidationTrigger {
  id: string;
  label: string;
  metric: string;
  threshold: string;
  status: 'safe' | 'near' | 'triggered';
  sensitivity: 'low' | 'medium' | 'high';
  asOf: string;
  confidence: ConfidenceLevel;
}

export interface HeadlineItem {
  id: string;
  title: string;
  url: string;
  sourceCount: number;
  sources: string[];
  asOf: string;
  confidence: ConfidenceLevel;
}
