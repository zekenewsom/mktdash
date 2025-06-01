import { Request, Response } from 'express';
import { getEconomicCalendar } from '../services/alphaVantageService';

export const getCalendarEvents = async (req: Request, res: Response) => {
  const horizon = (req.query.horizon as '3month' | '6month' | '12month') || '3month';
  if (!['3month', '6month', '12month'].includes(horizon)) {
    return res.status(400).json({ error: 'Invalid horizon parameter. Use 3month, 6month, or 12month.' });
  }
  try {
    const result = await getEconomicCalendar(horizon);
    if (result.error && !result.data) {
      if (result.error.includes("API rate limit hit")) {
        return res.status(429).json({ error: result.error, data: null });
      }
      return res.status(500).json({ error: result.error, data: null });
    }
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Controller error for getCalendarEvents:', error);
    return res.status(500).json({ error: error.message || 'Unknown server error fetching calendar events', data: null });
  }
};
