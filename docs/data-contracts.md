# mktdash Data Contracts (Draft)

## Canonical `DataPoint`

```ts
interface DataPoint {
  symbol: string;
  source: 'fred' | 'mock';
  as_of: string | null; // ISO date
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

## Canonical API Envelope

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

## Error Codes (initial)

- `VALIDATION_ERROR` – malformed or missing request params
- `UPSTREAM_FRED_ERROR` – data provider failure
- `INTERNAL_ERROR` – unexpected internal exception

## Compatibility Notes

- Frontend currently reads `response.data.data || response.data`, so this envelope is backward-friendly.
- `DATA_PROVIDER_MODE=mock_only` supports deterministic local development and demos.
