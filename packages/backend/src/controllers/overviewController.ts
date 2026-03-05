import { Request, Response } from 'express';
import { fetchSnapshotData } from '../services/overviewService';
import { sendError, sendSuccess } from '../lib/apiResponse';

export const getSnapshot = async (_req: Request, res: Response) => {
  try {
    const snapshot = await fetchSnapshotData();
    return sendSuccess(res, snapshot);
  } catch (err: any) {
    return sendError(res, 'INTERNAL_ERROR', err.message || 'Failed to fetch snapshot', 500);
  }
};
