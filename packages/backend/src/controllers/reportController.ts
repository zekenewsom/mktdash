import { Request, Response } from 'express';
import { sendError, sendSuccess } from '../lib/apiResponse';
import { generateDeterministicReport } from '../services/reportService';

export const generateDailyReport = async (req: Request, res: Response) => {
  try {
    const report = await generateDeterministicReport(req.body || {});
    return sendSuccess(res, {
      message: 'Daily report generated',
      status: 'ready',
      report,
    });
  } catch (err: any) {
    return sendError(res, 'INTERNAL_ERROR', err.message || 'Failed to generate report', 500);
  }
};
