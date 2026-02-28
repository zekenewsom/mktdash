import { Request, Response } from 'express';
import { sendError, sendSuccess } from '../lib/apiResponse';
import { fetchIntelligenceMetrics, METRIC_SERIES } from '../services/signalSources';

export const getIntelligenceMetrics = async (_req: Request, res: Response) => {
  try {
    const result = await fetchIntelligenceMetrics();
    if (result.error) {
      return sendError(res, 'UPSTREAM_DATA_WARNING', result.error, 200, undefined, result.data);
    }
    return sendSuccess(res, {
      as_of: new Date().toISOString(),
      metric_count: METRIC_SERIES.length,
      symbols: METRIC_SERIES,
      metrics: result.data,
    });
  } catch (err: any) {
    return sendError(res, 'INTERNAL_ERROR', err.message || 'Unknown error', 500);
  }
};
