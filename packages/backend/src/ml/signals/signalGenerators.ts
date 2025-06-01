import { DataPoint } from '../../utils/dateUtils';
import { MacdDataPoint } from '../indicators/technicalIndicators';

export interface Signal {
  date: string;
  type: 'SMA_CROSSOVER' | 'RSI' | 'MACD_CROSSOVER' | 'MACD_HISTOGRAM';
  signal: 'buy' | 'sell' | 'hold' | 'overbought' | 'oversold' | 'bullish_momentum' | 'bearish_momentum' | 'neutral';
  value?: number; // e.g., RSI value, or price at crossover
  details?: string;
}

/**
 * Generates signals based on SMA crossovers.
 */
export function generateSmaCrossoverSignals(
  priceData: DataPoint[],
  shortSmaSeries: DataPoint[],
  longSmaSeries: DataPoint[]
): Signal[] {
  const signals: Signal[] = [];
  if (shortSmaSeries.length === 0 || longSmaSeries.length === 0) return signals;

  // Align all series by date for easier comparison
  const combinedData: { date: string; price?: number; short?: number; long?: number }[] = [];
  const allDates = new Set([...priceData.map(p => p.date), ...shortSmaSeries.map(p => p.date), ...longSmaSeries.map(p => p.date)]);
  
  for (const date of Array.from(allDates).sort()) {
    combinedData.push({
      date,
      price: priceData.find(p => p.date === date)?.value,
      short: shortSmaSeries.find(p => p.date === date)?.value,
      long: longSmaSeries.find(p => p.date === date)?.value,
    });
  }
  
  combinedData.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());


  for (let i = 1; i < combinedData.length; i++) {
    const prev = combinedData[i - 1];
    const curr = combinedData[i];

    if (prev.short === undefined || prev.long === undefined || curr.short === undefined || curr.long === undefined || curr.price === undefined) {
      continue;
    }

    // Golden Cross (Buy Signal)
    if (prev.short <= prev.long && curr.short > curr.long) {
      signals.push({
        date: curr.date,
        type: 'SMA_CROSSOVER',
        signal: 'buy',
        value: curr.price,
        details: `Golden Cross: Short SMA (${curr.short.toFixed(2)}) crossed above Long SMA (${curr.long.toFixed(2)})`,
      });
    }
    // Death Cross (Sell Signal)
    else if (prev.short >= prev.long && curr.short < curr.long) {
      signals.push({
        date: curr.date,
        type: 'SMA_CROSSOVER',
        signal: 'sell',
        value: curr.price,
        details: `Death Cross: Short SMA (${curr.short.toFixed(2)}) crossed below Long SMA (${curr.long.toFixed(2)})`,
      });
    }
  }
  return signals;
}

/**
 * Generates signals based on RSI overbought/oversold levels.
 */
export function generateRsiSignals(
  rsiSeries: DataPoint[],
  overboughtThreshold: number,
  oversoldThreshold: number
): Signal[] {
  const signals: Signal[] = [];
  if (rsiSeries.length === 0) return signals;

  for (let i = 0; i < rsiSeries.length; i++) {
    const curr = rsiSeries[i];
    const prev = i > 0 ? rsiSeries[i-1] : null;

    if (curr.value >= overboughtThreshold) {
        // Check if it just crossed into overbought
        if (!prev || prev.value < overboughtThreshold) {
             signals.push({
                date: curr.date,
                type: 'RSI',
                signal: 'overbought',
                value: curr.value,
                details: `RSI (${curr.value.toFixed(2)}) entered overbought zone (> ${overboughtThreshold})`,
            });
        }
    } else if (curr.value <= oversoldThreshold) {
        // Check if it just crossed into oversold
        if (!prev || prev.value > oversoldThreshold) {
            signals.push({
                date: curr.date,
                type: 'RSI',
                signal: 'oversold',
                value: curr.value,
                details: `RSI (${curr.value.toFixed(2)}) entered oversold zone (< ${oversoldThreshold})`,
            });
        }
    } else {
        // Check if it just exited overbought (potential sell confirmation)
        if (prev && prev.value >= overboughtThreshold) {
             signals.push({
                date: curr.date,
                type: 'RSI',
                signal: 'neutral', // Or 'exit_overbought'
                value: curr.value,
                details: `RSI (${curr.value.toFixed(2)}) exited overbought zone`,
            });
        }
        // Check if it just exited oversold (potential buy confirmation)
        else if (prev && prev.value <= oversoldThreshold) {
             signals.push({
                date: curr.date,
                type: 'RSI',
                signal: 'neutral', // Or 'exit_oversold'
                value: curr.value,
                details: `RSI (${curr.value.toFixed(2)}) exited oversold zone`,
            });
        }
    }
  }
  return signals;
}

/**
 * Generates signals based on MACD line and signal line crossovers, and histogram.
 */
export function generateMacdSignals(macdSeries: MacdDataPoint[]): Signal[] {
  const signals: Signal[] = [];
  if (macdSeries.length === 0) return signals;

  for (let i = 1; i < macdSeries.length; i++) {
    const prev = macdSeries[i - 1];
    const curr = macdSeries[i];

    if (curr.MACD === undefined || curr.signal === undefined || prev.MACD === undefined || prev.signal === undefined) {
      continue;
    }

    // MACD line crosses above Signal line (Buy Signal)
    if (prev.MACD <= prev.signal && curr.MACD > curr.signal) {
      signals.push({
        date: curr.date,
        type: 'MACD_CROSSOVER',
        signal: 'buy',
        value: curr.MACD,
        details: `MACD (${curr.MACD.toFixed(2)}) crossed above Signal (${curr.signal.toFixed(2)})`,
      });
    }
    // MACD line crosses below Signal line (Sell Signal)
    else if (prev.MACD >= prev.signal && curr.MACD < curr.signal) {
      signals.push({
        date: curr.date,
        type: 'MACD_CROSSOVER',
        signal: 'sell',
        value: curr.MACD,
        details: `MACD (${curr.MACD.toFixed(2)}) crossed below Signal (${curr.signal.toFixed(2)})`,
      });
    }

    // Histogram crosses above zero (Bullish Momentum)
    if (curr.histogram !== undefined && prev.histogram !== undefined) {
        if (prev.histogram <= 0 && curr.histogram > 0) {
             signals.push({
                date: curr.date,
                type: 'MACD_HISTOGRAM',
                signal: 'bullish_momentum',
                value: curr.histogram,
                details: `MACD Histogram crossed above zero (${curr.histogram.toFixed(2)})`,
            });
        }
        // Histogram crosses below zero (Bearish Momentum)
        else if (prev.histogram >= 0 && curr.histogram < 0) {
             signals.push({
                date: curr.date,
                type: 'MACD_HISTOGRAM',
                signal: 'bearish_momentum',
                value: curr.histogram,
                details: `MACD Histogram crossed below zero (${curr.histogram.toFixed(2)})`,
            });
        }
    }
  }
  return signals;
}
