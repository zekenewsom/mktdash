import { Request, Response } from 'express';
import { fetchUnifiedData, UnifiedDataRequest } from '../services/unifiedDataService';

/**
 * Unified data endpoint - aggregates all data sources
 * Request body should specify which sources to fetch:
 * {
 *   fred: ['ICSA', 'CCSA'],
 *   rba: ['BUSINESS_CREDIT', 'HOUSING_CREDIT'],
 *   bcb: ['IPCA', 'UNEMPLOYMENT'],
 *   eurostat: ['HICP_DE', 'GDP_EA'],
 *   yfinance: ['EEM', 'EMB'],
 *   pmi: ['CHINA_MANUFACTURING', 'US_MANUFACTURING']
 * }
 */
export async function getUnifiedData(req: Request, res: Response) {
  try {
    const request: UnifiedDataRequest = req.body || {};
    
    const result = await fetchUnifiedData(request);
    
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch data',
    });
  }
}

/**
 * Phase 2 Data - convenience endpoint for Daily Shot Phase 2
 * Fetches: RBA, BCB, Eurostat, Stats NZ, PMIs
 */
export async function getPhase2Data(req: Request, res: Response) {
  try {
    const result = await fetchUnifiedData({
      rba: ['FIRCRTG', 'BCREDITSA', 'HCREDITSA', 'CAPEXSA'],
      bcb: ['CREDIT_OBSERVED', 'IPCA', 'UNEMPLOYMENT', 'TRADE_BALANCE'],
      eurostat: ['HICP_DE', 'HICP_FR', 'HICP_IT', 'HICP_ES', 'UNEMP_DE', 'UNEMP_FR', 'UNEMP_IT', 'UNEMP_ES', 'GDP_EA', 'ESI_EA'],
      statsnz: ['RETAIL_SALES', 'BUILDING_PERMITS', 'GDP'],
      pmi: [
        'CHINA_MANUFACTURING', 'KOREA_MANUFACTURING', 'JAPAN_MANUFACTURING',
        'INDIA_MANUFACTURING', 'AUSTRALIA_MANUFACTURING', 'EUROZONE_MANUFACTURING',
        'US_MANUFACTURING', 'UK_MANUFACTURING'
      ],
    });
    
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch Phase 2 data',
    });
  }
}

/**
 * Phase 3 Data - EM composites via YFinance
 */
export async function getPhase3Data(req: Request, res: Response) {
  try {
    const result = await fetchUnifiedData({
      yfinance: ['EEM', 'VWO', 'VWOB', 'EMB', 'EWZ', 'EWW', 'EWY', 'EPI'],
    });
    
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch Phase 3 data',
    });
  }
}
