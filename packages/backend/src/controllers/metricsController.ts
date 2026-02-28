import { Request, Response } from 'express';
import { sendError, sendSuccess } from '../lib/apiResponse';
import { fetchMacroData } from '../services/fredService';

const METRIC_SERIES = [
  'FEDFUNDS', 'CPIAUCSL', 'UNRATE',
  'DGS10', 'DGS2', 'T10Y2Y',
  'DTWEXBGS', 'DEXUSEU',
  'DCOILWTICO', 'GOLDAMGBD228NLBM',
  'VIXCLS', 'BAMLH0A0HYM2'
];

export const getIntelligenceMetrics = async (_req: Request, res: Response) => {
  try {
    const result = await fetchMacroData(METRIC_SERIES);
    if (result.error) {
      return sendError(res, 'UPSTREAM_DATA_WARNING', result.error, 200, undefined, result.data);
    }
    return sendSuccess(res, result.data);
  } catch (err: any) {
    return sendError(res, 'INTERNAL_ERROR', err.message || 'Unknown error', 500);
  }
};
