import { Response } from 'express';
import { ApiError, ApiResponse } from '../contracts/marketData';

function baseMeta() {
  return {
    generated_at: new Date().toISOString(),
  };
}

export function sendSuccess<T>(res: Response, data: T, status = 200) {
  const payload: ApiResponse<T> = {
    ok: true,
    data,
    error: null,
    meta: baseMeta(),
  };
  return res.status(status).json(payload);
}

export function sendError(
  res: Response,
  code: string,
  message: string,
  status = 500,
  details?: unknown,
  data: unknown = null,
) {
  const error: ApiError = { code, message, details };
  const payload: ApiResponse<unknown> = {
    ok: false,
    data,
    error,
    meta: baseMeta(),
  };
  return res.status(status).json(payload);
}
