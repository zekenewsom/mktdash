// packages/backend/src/utils/dateUtils.ts

/**
 * Represents a data point with a date and a value.
 */
export interface DataPoint {
  date: string; // YYYY-MM-DD
  value: number;
}

/**
 * Finds the data point in a sorted historical array that is closest to (but not after) a target date.
 * @param historicalData Sorted array of DataPoints (ascending by date).
 * @param targetDate The target date string (YYYY-MM-DD).
 * @returns The found DataPoint or null if no suitable point is found.
 */
export function findDataPointOnOrBefore(
  historicalData: DataPoint[],
  targetDate: Date
): DataPoint | null {
  if (!historicalData || historicalData.length === 0) {
    return null;
  }

  // Iterate backwards to find the first point on or before the targetDate
  for (let i = historicalData.length - 1; i >= 0; i--) {
    const pointDate = new Date(historicalData[i].date);
    // Adjust pointDate to be at the start of its day for fair comparison with targetDate (which is also start of day)
    pointDate.setUTCHours(0, 0, 0, 0);
    if (pointDate <= targetDate) {
      return historicalData[i];
    }
  }
  return null; // No data point found on or before the target date
}

/**
 * Calculates past dates for metric comparisons.
 * @param currentDate The reference current date.
 * @returns An object with various past date points.
 */
export function getPastDates(currentDate: Date) {
  const oneDayAgo = new Date(currentDate);
  oneDayAgo.setDate(currentDate.getDate() - 1);

  const oneWeekAgo = new Date(currentDate);
  oneWeekAgo.setDate(currentDate.getDate() - 7);

  const oneMonthAgo = new Date(currentDate);
  oneMonthAgo.setMonth(currentDate.getMonth() - 1);

  const threeMonthsAgo = new Date(currentDate);
  threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

  const sixMonthsAgo = new Date(currentDate);
  sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

  const oneYearAgo = new Date(currentDate);
  oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

  // For YTD, we want the last day of the previous year.
  // If historical data is sparse, finding the closest point to Dec 31st is better than Jan 1st.
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
  const lastDayOfPrevYear = new Date(currentDate.getFullYear() -1, 11, 31);


  return {
    current: currentDate,
    oneDayAgo,
    oneWeekAgo,
    oneMonthAgo,
    threeMonthsAgo,
    sixMonthsAgo,
    oneYearAgo,
    lastDayOfPrevYear, // For YTD calculation against previous year's close
    startOfYear, // For referencing the start of the current year
  };
}

/**
 * Calculates Simple Moving Average (SMA) for a given period from the end of the data.
 * @param data Sorted array of DataPoints (ascending by date).
 * @param period The number of data points to include in the SMA.
 * @returns The SMA value or null if not enough data.
 */
export function calculateSMA(data: DataPoint[], period: number): number | null {
  if (!data || data.length < period) {
    return null;
  }
  const relevantData = data.slice(data.length - period);
  const sum = relevantData.reduce((acc, point) => acc + point.value, 0);
  return parseFloat((sum / period).toFixed(4));
}

/**
 * Calculates Simple Moving Average (SMA) series for given historical data.
 * @param data Sorted array of DataPoints (ascending by date).
 * @param period The number of data points to include in the SMA.
 * @returns An array of DataPoints representing the SMA, or an empty array if not enough data.
 * Each SMA point will have the date of the last point in its calculation window.
 */
export function calculateHistoricalSMA(data: DataPoint[], period: number): DataPoint[] {
  if (!data || data.length < period) {
    return [];
  }
  const smaSeries: DataPoint[] = [];
  for (let i = period - 1; i < data.length; i++) {
    const window = data.slice(i - period + 1, i + 1);
    const sum = window.reduce((acc, point) => acc + point.value, 0);
    smaSeries.push({
      date: data[i].date,
      value: parseFloat((sum / period).toFixed(4)),
    });
  }
  return smaSeries;
}

/**
 * Filters data points within the last N days from a reference end date.
 * @param historicalData Sorted array of DataPoints (ascending by date).
 * @param endDate The reference end date.
 * @param days The number of days to look back.
 * @returns Filtered array of DataPoints.
 */
export function getDataForLastNDays(
  historicalData: DataPoint[],
  endDate: Date,
  days: number
): DataPoint[] {
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - days);
  startDate.setUTCHours(0,0,0,0);

  return historicalData.filter(point => {
    const pointDate = new Date(point.date);
    pointDate.setUTCHours(0,0,0,0);
    return pointDate >= startDate && pointDate <= endDate;
  });
}

/**
 * Calculates performance metrics (absolute and percentage change).
 * @param currentValue The current value.
 * @param pastValue The past value.
 * @returns Metrics object or null if pastValue is not valid.
 */
export function calculatePerformance(currentValue: number, pastValue: number | null | undefined) {
  if (pastValue === null || pastValue === undefined || pastValue === 0) { // Avoid division by zero for percentage
    return { absoluteChange: null, percentChange: null };
  }
  const absoluteChange = currentValue - pastValue;
  const percentChange = (absoluteChange / pastValue) * 100;
  return {
    absoluteChange: parseFloat(absoluteChange.toFixed(4)), // Adjust precision as needed
    percentChange: parseFloat(percentChange.toFixed(2)),
  };
}
