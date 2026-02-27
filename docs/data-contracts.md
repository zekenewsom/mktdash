# mktdash Data Contracts

## 1) Canonical `DataPoint`

```ts
interface DataPoint {
  symbol: string;
  source: 'fred' | 'mock';
  as_of: string | null; // ISO date/time
  value: number | null;
  unit: string;
  quality_flags?: {
    stale?: boolean;
    missing?: boolean;
    partial?: boolean;
    fallback?: boolean;
  };
}
```

## 2) Canonical API Envelope

```ts
interface ApiResponse<T> {
  ok: boolean;
  data: T | null;
  error: {
    code: string;
    message: string;
    details?: unknown;
  } | null;
  meta?: {
    generated_at: string; // ISO timestamp
    request_id?: string;
  };
}
```

## 3) Intelligence Overview Contract (`/api/intelligence/overview`)

```ts
interface IntelligenceOverview {
  regime: {
    state: 'risk_on' | 'neutral' | 'risk_off';
    score: number;
    confidence: 'high' | 'medium' | 'low';
    drivers: Array<{
      key: string;
      label: string;
      direction: 'up' | 'down' | 'flat';
      impact: 'positive' | 'negative' | 'neutral';
    }>;
    quality: {
      as_of: string;
      source: string;
      confidence: 'high' | 'medium' | 'low';
      quality_flags?: {
        stale?: boolean;
        fallback?: boolean;
        missing?: boolean;
        partial?: boolean;
      };
    };
  };
  changes: Array<{
    id: string;
    title: string;
    detail: string;
    category: 'growth' | 'inflation' | 'liquidity' | 'risk' | 'policy' | 'other';
    direction: 'bullish' | 'bearish' | 'neutral';
    as_of: string;
    confidence: 'high' | 'medium' | 'low';
    source: string;
  }>;
  quality: {
    as_of: string;
    confidence: 'high' | 'medium' | 'low';
    fallback_used: boolean;
    stale_used: boolean;
    stale_count: number;
    sources: string[];
  };
}
```

## 4) Data Quality Contract (`/api/health/data-quality`)

```ts
interface DataQualityPayload {
  generated_at: string;
  totals: {
    metrics: number;
    stale_count: number;
    fallback_count: number;
  };
  records: Array<{
    symbol: string;
    source: string;
    as_of: string | null;
    age_mins: number | null;
    stale: boolean;
    fallback: boolean;
    quality_flags?: Record<string, boolean>;
  }>;
  dataset_metrics?: {
    freshness_ratio: number;      // 0..1
    completeness_ratio: number;   // 0..1
    drift: {
      index_drift_count: number;
      index_drift_flags: Array<{ symbol: string; percent_change?: number; drift: boolean }>;
    };
    calendar: {
      event_count: number;
      upcoming_count: number;
      source_fallback_used: boolean;
    };
  };
  provider_errors: string[];
}
```

## 5) Request Metrics Contract (`/api/health/metrics`)

```ts
interface RequestMetricsPayload {
  generated_at: string;
  metrics: {
    window_minutes: number;
    sample_count: number;
    p50_ms: number;
    p95_ms: number;
    max_ms: number;
    by_path: Record<string, {
      count: number;
      p50_ms: number;
      p95_ms: number;
      max_ms: number;
    }>;
  };
}
```

## 6) Calendar Event Contract (`/api/calendar/events`)

```ts
interface CalendarEvent {
  id: string;
  title: string;
  country: string;
  impact: 'high' | 'medium' | 'low';
  scheduled_at: string;
  category: 'inflation' | 'labor' | 'growth' | 'policy' | 'other';
  source: string;
}
```

## 7) Runtime Validation

Contract validators are implemented in:
- `packages/backend/src/lib/validators.ts`

Currently enforced at controller boundaries for:
- intelligence overview payload
- calendar events payload
- data quality payload

If validation fails, API returns `VALIDATION_ERROR` and includes payload in `data` for debugging.

## 8) Error Codes (active)

- `VALIDATION_ERROR` – malformed request or contract mismatch
- `UPSTREAM_FRED_ERROR` – data provider failure
- `UPSTREAM_DATA_WARNING` – partial intelligence due to provider issues
- `UPSTREAM_CALENDAR_WARNING` – calendar fallback in use
- `INTERNAL_ERROR` – unexpected internal exception
