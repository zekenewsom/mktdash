export type DataSource = 'fred' | 'mock';

export interface QualityFlags {
  stale?: boolean;
  missing?: boolean;
  partial?: boolean;
  fallback?: boolean;
}

export interface DataPoint {
  symbol: string;
  source: DataSource;
  as_of: string | null;
  value: number | null;
  unit: string;
  quality_flags?: QualityFlags;
}

export interface TimeSeriesPoint {
  symbol: string;
  source: DataSource;
  as_of: string;
  value: number;
  unit: string;
  quality_flags?: QualityFlags;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  ok: boolean;
  data: T | null;
  error: ApiError | null;
  meta?: {
    request_id?: string;
    generated_at: string;
  };
}
