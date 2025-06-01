import { SMA, RSI, MACD, MACDInput } from 'technicalindicators';
import { DataPoint } from '../../utils/dateUtils'; // Assuming DataPoint is { date: string, value: number }

/**
 * Calculates Simple Moving Average (SMA) series.
 * @param historicalData Array of DataPoint objects, sorted by date.
 * @param period The period for SMA calculation.
 * @returns Array of DataPoint objects representing the SMA, or empty if not enough data.
 */
export function calculateSmaSeries(historicalData: DataPoint[], period: number): DataPoint[] {
  if (historicalData.length < period) return [];
  const values = historicalData.map(p => p.value);
  const smaResults = SMA.calculate({ period, values });

  // SMA result is shorter than input, align with dates from the end of the period
  return smaResults.map((smaValue, index) => ({
    date: historicalData[index + period - 1].date,
    value: parseFloat(smaValue.toFixed(4)),
  }));
}

/**
 * Calculates Relative Strength Index (RSI) series.
 * @param historicalData Array of DataPoint objects, sorted by date.
 * @param period The period for RSI calculation.
 * @returns Array of DataPoint objects representing the RSI, or empty if not enough data.
 */
export function calculateRsiSeries(historicalData: DataPoint[], period: number): DataPoint[] {
  if (historicalData.length < period) return [];
  const values = historicalData.map(p => p.value);
  const rsiResults = RSI.calculate({ period, values });

  // RSI result is shorter, align with dates
  return rsiResults.map((rsiValue, index) => ({
    date: historicalData[index + period].date, // RSI typically needs one more initial period
    value: parseFloat(rsiValue.toFixed(2)),
  }));
}

/**
 * Calculates Moving Average Convergence Divergence (MACD) series.
 * @param historicalData Array of DataPoint objects, sorted by date.
 * @param fastPeriod Fast EMA period.
 * @param slowPeriod Slow EMA period.
 * @param signalPeriod Signal line EMA period.
 * @returns Array of MACD DataPoint objects, or empty if not enough data.
 */
export interface MacdDataPoint {
  date: string;
  MACD?: number;
  signal?: number;
  histogram?: number;
}

export function calculateMacdSeries(
  historicalData: DataPoint[],
  fastPeriod: number,
  slowPeriod: number,
  signalPeriod: number
): MacdDataPoint[] {
  if (historicalData.length < slowPeriod + signalPeriod) return []; // Rough check for enough data
  const values = historicalData.map(p => p.value);

  const macdInput: MACDInput = {
    values,
    fastPeriod,
    slowPeriod,
    signalPeriod,
    SimpleMAOscillator: false, // Use EMA for MACD
    SimpleMASignal: false,   // Use EMA for Signal line
  };

  const macdResults = MACD.calculate(macdInput);

  // MACD results are shorter. The first result corresponds to the data point at index (slowPeriod + signalPeriod - 2)
  // or more simply, the length of macdResults is historicalData.length - (slowPeriod -1) - (signalPeriod -1)
  const offset = historicalData.length - macdResults.length;

  return macdResults.map((macdOutput, index) => ({
    date: historicalData[index + offset].date,
    MACD: macdOutput.MACD !== undefined ? parseFloat(macdOutput.MACD.toFixed(4)) : undefined,
    signal: macdOutput.signal !== undefined ? parseFloat(macdOutput.signal.toFixed(4)) : undefined,
    histogram: macdOutput.histogram !== undefined ? parseFloat(macdOutput.histogram.toFixed(4)) : undefined,
  }));
}
