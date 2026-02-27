import { Request, Response } from 'express';
import { sendError, sendSuccess } from '../lib/apiResponse';
import { fetchEconomicCalendar } from '../services/calendarService';
import { validateCalendarEvents } from '../lib/validators';

export const getEconomicCalendar = async (_req: Request, res: Response) => {
  try {
    const result = await fetchEconomicCalendar();

    if (!validateCalendarEvents(result.data)) {
      return sendError(res, 'VALIDATION_ERROR', 'Calendar payload failed contract validation', 500, undefined, result.data);
    }

    if (result.error) {
      return sendError(res, 'UPSTREAM_CALENDAR_WARNING', result.error, 200, undefined, result.data);
    }
    return sendSuccess(res, result.data);
  } catch (err: any) {
    return sendError(res, 'INTERNAL_ERROR', err.message || 'Unknown error', 500);
  }
};
