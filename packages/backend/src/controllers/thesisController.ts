import { Request, Response } from 'express';
import { sendError, sendSuccess } from '../lib/apiResponse';
import { buildCurrentThesis, getThesisHistory } from '../services/thesisService';

export const getCurrentThesis = async (_req: Request, res: Response) => {
  try {
    const result = await buildCurrentThesis();
    if (result.error) {
      return sendError(res, 'UPSTREAM_DATA_WARNING', result.error, 200, undefined, result.data);
    }
    return sendSuccess(res, result.data);
  } catch (err: any) {
    return sendError(res, 'INTERNAL_ERROR', err.message || 'Unknown error', 500);
  }
};

export const getThesisTimeline = async (_req: Request, res: Response) => {
  try {
    const result = getThesisHistory();
    return sendSuccess(res, result.data);
  } catch (err: any) {
    return sendError(res, 'INTERNAL_ERROR', err.message || 'Unknown error', 500);
  }
};
