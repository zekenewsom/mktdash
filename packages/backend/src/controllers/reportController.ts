import { Request, Response } from 'express';
import { generateDailySummaryReport } from '../services/reportService';
import path from 'path';

// Placeholder controller for triggering daily report generation
export const generateDailyReport = async (req: Request, res: Response) => {
  console.log('Received request to generate daily report');
  try {
    console.log('[reportController] About to call generateDailySummaryReport');
    const reportResult = await generateDailySummaryReport();
    if (reportResult.success && reportResult.pdfBuffer) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${path.basename(reportResult.filePath || 'mktdash_report.pdf')}`);
      res.send(reportResult.pdfBuffer);
    } else {
      res.status(500).json({
        message: 'Failed to generate daily report.',
        status: 'error',
        error: reportResult.error || 'Unknown error during report generation.',
      });
    }
  } catch (error: any) {
    console.error('Error in generateDailyReport controller:', error);
    res.status(500).json({
      message: 'Server error while generating report.',
      status: 'error',
      error: error.message,
    });
  }
};