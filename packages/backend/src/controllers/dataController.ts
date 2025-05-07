import { Request, Response } from 'express';

// Placeholder controller for fetching macroeconomic data
import { fetchMacroData } from '../services/fredService';

export const getMacroData = async (req: Request, res: Response) => {
  // Fetch macroeconomic indicators from FRED API via service
  const seriesIds = ['FEDFUNDS', 'CPIAUCSL', 'UNRATE'];
  try {
    const result = await fetchMacroData(seriesIds);
    if (result.error) {
      // Return 500 with fallback/mock data and error message
      return res.status(500).json({ error: result.error, data: result.data });
    }
    // Success: return the data
    return res.status(200).json(result.data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Unknown error', data: null });
  }
};

// Placeholder controller for fetching market index performance
import { fetchIndexPerformance } from '../services/marketDataService';

export const getMarketIndices = async (req: Request, res: Response) => {
  // Fetch market indices from Alpha Vantage (or fallback)
  try {
    const result = await fetchIndexPerformance();
    if (result.error) {
      return res.status(500).json({ error: result.error, data: result.data });
    }
    return res.status(200).json(result.data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Unknown error', data: null });
  }
};