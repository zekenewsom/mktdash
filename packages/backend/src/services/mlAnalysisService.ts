import { getSeriesDetails } from './marketDataService';
import { getCryptoDetails } from './coinGeckoService';
import { calculateSmaSeries, calculateRsiSeries, calculateMacdSeries, MacdDataPoint } from '../ml/indicators/technicalIndicators';
import { generateSmaCrossoverSignals, generateRsiSignals, generateMacdSignals, Signal } from '../ml/signals/signalGenerators';
import { DataPoint } from '../utils/dateUtils';

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

export async function runTechnicalAnalysis(
  id: string,
  dataSourceType: 'fred' | 'crypto',
  analysisType: 'SMA_CROSSOVER' | 'RSI' | 'MACD',
  params: any
): Promise<TechnicalAnalysisResult> {
  let historicalData: DataPoint[] | undefined;
  let seriesInfo: any = {};

  try {
    if (dataSourceType === 'fred') {
      const result = await getSeriesDetails(id);
      if (result.error && !result.data?.historical?.length) throw new Error(result.error || 'Failed to fetch FRED data');
      historicalData = result.data?.historical;
      seriesInfo = result.data?.seriesInfo;
    } else if (dataSourceType === 'crypto') {
      const result = await getCryptoDetails(id);
      if (result.error && !result.data?.historical?.length) throw new Error(result.error || 'Failed to fetch Crypto data');
      historicalData = result.data?.historical;
      seriesInfo = result.data?.seriesInfo;
    }

    if (!historicalData || historicalData.length === 0) {
      throw new Error('No historical data available for analysis.');
    }
    
    historicalData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let indicatorData: DataPoint[] | MacdDataPoint[] | undefined;
    let secondaryIndicatorData: DataPoint[] | undefined;
    let signals: Signal[] = [];

    switch (analysisType) {
      case 'SMA_CROSSOVER':
        const shortPeriod = parseInt(params.shortPeriod, 10) || 50;
        const longPeriod = parseInt(params.longPeriod, 10) || 200;
        if (shortPeriod >= longPeriod) throw new Error('Short period must be less than long period for SMA Crossover.');
        
        const shortSma = calculateSmaSeries(historicalData, shortPeriod);
        const longSma = calculateSmaSeries(historicalData, longPeriod);
        
        indicatorData = shortSma;
        secondaryIndicatorData = longSma;
        signals = generateSmaCrossoverSignals(historicalData, shortSma, longSma);
        break;

      case 'RSI':
        const rsiPeriod = parseInt(params.period, 10) || 14;
        const overbought = parseFloat(params.overbought) || 70;
        const oversold = parseFloat(params.oversold) || 30;
        
        const rsiSeries = calculateRsiSeries(historicalData, rsiPeriod);
        indicatorData = rsiSeries;
        signals = generateRsiSignals(rsiSeries, overbought, oversold);
        break;
        
      case 'MACD':
        const fastPeriod = parseInt(params.fastPeriod, 10) || 12;
        const slowPeriod = parseInt(params.slowPeriod, 10) || 26;
        const signalPeriod = parseInt(params.signalPeriod, 10) || 9;

        const macdSeries = calculateMacdSeries(historicalData, fastPeriod, slowPeriod, signalPeriod);
        indicatorData = macdSeries;
        signals = generateMacdSignals(macdSeries);
        break;

      default:
        throw new Error(`Unsupported analysis type: ${analysisType}`);
    }

    return {
      seriesId: id,
      analysisType,
      parameters: params,
      baseData: historicalData,
      indicatorData,
      secondaryIndicatorData,
      signals,
    };

  } catch (error: any) {
    console.error(`Error in runTechnicalAnalysis for ${id} (${analysisType}):`, error);
    return {
      seriesId: id,
      analysisType,
      parameters: params,
      baseData: historicalData || [],
      signals: [],
      error: error.message || 'An unknown error occurred during analysis.',
    };
  }
}
