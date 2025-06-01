import axios from 'axios';

// Define types based on backend's TechnicalAnalysisResult and Signal
export interface DataPoint {
  date: string;
  value: number;
}

export interface MacdDataPoint {
  date: string;
  MACD?: number;
  signal?: number;
  histogram?: number;
}

export interface Signal {
  date: string;
  type: 'SMA_CROSSOVER' | 'RSI' | 'MACD_CROSSOVER' | 'MACD_HISTOGRAM';
  signal: 'buy' | 'sell' | 'hold' | 'overbought' | 'oversold' | 'bullish_momentum' | 'bearish_momentum' | 'neutral';
  value?: number;
  details?: string;
}

export interface TechnicalAnalysisResult {
  seriesId: string;
  analysisType: string;
  parameters: any;
  baseData: DataPoint[];
  indicatorData?: DataPoint[] | MacdDataPoint[];
  secondaryIndicatorData?: DataPoint[];
  signals: Signal[];
  error?: string;
}

export interface AnalysisParams {
  // SMA Crossover
  shortPeriod?: number;
  longPeriod?: number;
  // RSI
  period?: number;
  overbought?: number;
  oversold?: number;
  // MACD
  fastPeriod?: number;
  slowPeriod?: number;
  signalPeriod?: number;
}

export const runTechnicalAnalysis = async (
  seriesId: string,
  dataSourceType: 'fred' | 'crypto',
  analysisType: 'SMA_CROSSOVER' | 'RSI' | 'MACD',
  params: AnalysisParams
): Promise<TechnicalAnalysisResult> => {
  try {
    const response = await axios.post<TechnicalAnalysisResult>('/api/ml/technical-analysis', {
      seriesId,
      dataSourceType,
      analysisType,
      params,
    });
    if (response.data.error && !response.data.signals?.length) {
        throw new Error(response.data.error);
    }
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.error || error.response.data?.message || 'Failed to run technical analysis');
    }
    throw new Error(error.message || 'An unknown error occurred during analysis.');
  }
};
