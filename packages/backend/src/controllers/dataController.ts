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

// New: Historical index data controller
export const getIndexHistory = async (req: Request, res: Response) => {
  // Backwards compatible for index history

  const { index } = req.query;
  if (!index || typeof index !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid index query param' });
  }
  try {
    const result = await fetchIndexHistory(index);
    if (result.error) {
      return res.status(500).json({ error: result.error, data: result.data });
    }
    return res.status(200).json(result.data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Unknown error', data: null });
  }
};

// Generic historical data controller for any FRED series
export const getSeriesHistory = async (req: Request, res: Response) => {
  const { series } = req.query;
  if (!series || typeof series !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid series query param' });
  }
  try {
    const result = await fetchFredSeriesHistory(series);
    if (result.error) {
      return res.status(500).json({ error: result.error, data: result.data });
    }
    return res.status(200).json(result.data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Unknown error', data: null });
  }
};

// Placeholder controller for fetching market index performance
import { fetchIndexPerformance, fetchIndexHistory, fetchFredSeriesHistory, getSeriesDetails } from '../services/marketDataService';

// --- NEW CONTROLLER FUNCTION ---
export const getSingleSeriesDetails = async (req: Request, res: Response) => {
  const { seriesId } = req.params;
  if (!seriesId || typeof seriesId !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid seriesId path parameter' });
  }

  try {
    const result = await getSeriesDetails(seriesId);
    if (result.error && !result.data) { // If there's an error and absolutely no data
      return res.status(500).json({ error: result.error, data: null });
    }
    // If data is null but no error, or data is present, send it
    return res.status(200).json(result); // result is { data: { ... }, error: ... }
  } catch (err: any) {
    console.error(`Controller error for getSingleSeriesDetails ${seriesId}:`, err);
    return res.status(500).json({ error: err.message || 'Unknown server error', data: null });
  }
};

export const getMarketIndices = async (req: Request, res: Response) => {
  // Fetch market indices from FRED (value, date)

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