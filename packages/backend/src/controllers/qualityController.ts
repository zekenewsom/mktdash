import { Request, Response } from 'express';
import { sendError, sendSuccess } from '../lib/apiResponse';
import { assessSleeveQuality } from '../services/qualityService';

export const getQualityIntelligence = async (_req: Request, res: Response) => {
  try {
    const result = await assessSleeveQuality();
    if (result.error) {
      return sendError(res, 'UPSTREAM_DATA_WARNING', result.error, 200, undefined, result.data);
    }
    return sendSuccess(res, result.data);
  } catch (err: any) {
    return sendError(res, 'INTERNAL_ERROR', err.message || 'Unknown error', 500);
  }
};
