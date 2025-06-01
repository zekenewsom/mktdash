import { Request, Response } from 'express';
import { runTechnicalAnalysis, TechnicalAnalysisResult } from '../services/mlAnalysisService';

export const handleTechnicalAnalysisRequest = async (req: Request, res: Response) => {
  const { seriesId, dataSourceType, analysisType, params } = req.body;

  if (!seriesId || !dataSourceType || !analysisType) {
    return res.status(400).json({ error: 'Missing required fields: seriesId, dataSourceType, analysisType' });
  }

  if (!['fred', 'crypto'].includes(dataSourceType)) {
    return res.status(400).json({ error: 'Invalid dataSourceType. Must be "fred" or "crypto".' });
  }
  
  if (!['SMA_CROSSOVER', 'RSI', 'MACD'].includes(analysisType)) {
    return res.status(400).json({ error: 'Invalid analysisType.' });
  }

  try {
    const result: TechnicalAnalysisResult = await runTechnicalAnalysis(seriesId, dataSourceType, analysisType, params || {});
    if (result.error && result.signals.length === 0) {
        return res.status(500).json(result);
    }
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Controller error in handleTechnicalAnalysisRequest:', error);
    return res.status(500).json({
      seriesId,
      analysisType,
      parameters: params,
      signals: [],
      error: error.message || 'Unknown server error during technical analysis.',
    });
  }
};
