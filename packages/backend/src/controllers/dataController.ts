import { Request, Response } from 'express';
import { fetchMacroData } from '../services/fredService';
import { fetchIndexPerformance, fetchIndexHistory, fetchFredSeriesHistory } from '../services/marketDataService';
import { sendError, sendSuccess } from '../lib/apiResponse';

export const getMacroData = async (_req: Request, res: Response) => {
  const seriesIds = ['FEDFUNDS', 'CPIAUCSL', 'UNRATE'];

  try {
    const result = await fetchMacroData(seriesIds);
    if (result.error) {
      return sendError(res, 'UPSTREAM_FRED_ERROR', result.error, 500, undefined, result.data);
    }
    return sendSuccess(res, result.data);
  } catch (err: any) {
    return sendError(res, 'INTERNAL_ERROR', err.message || 'Unknown error', 500);
  }
};

export const getIndexHistory = async (req: Request, res: Response) => {
  const { index } = req.query;
  if (!index || typeof index !== 'string') {
    return sendError(res, 'VALIDATION_ERROR', 'Missing or invalid index query param', 400);
  }

  try {
    const result = await fetchIndexHistory(index);
    if (result.error) {
      return sendError(res, 'UPSTREAM_FRED_ERROR', result.error, 500, { index }, result.data);
    }
    return sendSuccess(res, result.data);
  } catch (err: any) {
    return sendError(res, 'INTERNAL_ERROR', err.message || 'Unknown error', 500);
  }
};

export const getSeriesHistory = async (req: Request, res: Response) => {
  const { series } = req.query;
  if (!series || typeof series !== 'string') {
    return sendError(res, 'VALIDATION_ERROR', 'Missing or invalid series query param', 400);
  }

  try {
    const result = await fetchFredSeriesHistory(series);
    if (result.error) {
      return sendError(res, 'UPSTREAM_FRED_ERROR', result.error, 500, { series }, result.data);
    }
    return sendSuccess(res, result.data);
  } catch (err: any) {
    return sendError(res, 'INTERNAL_ERROR', err.message || 'Unknown error', 500);
  }
};

export const getMarketIndices = async (_req: Request, res: Response) => {
  try {
    const result = await fetchIndexPerformance();
    if (result.error) {
      return sendError(res, 'UPSTREAM_FRED_ERROR', result.error, 500, undefined, result.data);
    }
    return sendSuccess(res, result.data);
  } catch (err: any) {
    return sendError(res, 'INTERNAL_ERROR', err.message || 'Unknown error', 500);
  }
};
