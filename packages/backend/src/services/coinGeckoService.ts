import axios from 'axios';
import { fetchWithRetry } from '../utils/fetchWithRetry';
import { connectRedis, getCache, setCache } from '../utils/redis';
import { DataPoint, findDataPointOnOrBefore, getPastDates, calculatePerformance, calculateHistoricalSMA, getDataForLastNDays } from '../utils/dateUtils';

const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;
const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

interface CoinGeckoMarketChartResponse {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

interface CoinGeckoCoinInfoResponse {
  id: string;
  symbol: string;
  name: string;
  description?: { en?: string };
  market_data?: {
    current_price?: { [key: string]: number };
    market_cap?: { [key: string]: number };
    total_volume?: { [key: string]: number };
    price_change_percentage_24h?: number;
    last_updated?: string;
  };
  links?: { homepage?: string[] };
}

function transformCoinGeckoHistorical(prices: [number, number][]): DataPoint[] {
  return prices.map(([timestamp, price]) => ({
    date: new Date(timestamp).toISOString().split('T')[0],
    value: parseFloat(price.toFixed(4)),
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export async function getCryptoDetails(cryptoId: string, vsCurrency: string = 'usd', days: string = 'max') {
  await connectRedis();
  const cacheKey = `coingecko:details:${cryptoId}:${vsCurrency}:${days}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    console.log(`[Redis] CoinGecko cache hit for ${cacheKey}`);
    return cached;
  } else {
    console.log(`[Redis] CoinGecko cache miss for ${cacheKey}`);
  }
  if (!COINGECKO_API_KEY) {
    console.error('CoinGecko API key is missing.');
    return { data: null, error: 'CoinGecko API key is missing.' };
  }

  const headers = { 'x-cg-demo-api-key': COINGECKO_API_KEY };

  try {
    const [coinInfoRes, marketChartRes] = await Promise.all([
      fetchWithRetry(
        `${COINGECKO_BASE_URL}/coins/${cryptoId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
        {
          headers: COINGECKO_API_KEY ? { 'x-cg-pro-api-key': COINGECKO_API_KEY } : {},
        }
      ),
      fetchWithRetry(
        `${COINGECKO_BASE_URL}/coins/${cryptoId}/market_chart?vs_currency=${vsCurrency}&days=${days}&interval=daily`
      ),
    ]);

    const coinInfo = coinInfoRes.data;
    const historicalPrices = marketChartRes.data.prices;

    if (!coinInfo || !historicalPrices || historicalPrices.length === 0) {
      return { data: null, error: `No data found for ${cryptoId}` };
    }

    const historicalData = transformCoinGeckoHistorical(historicalPrices);

    const latestDataPoint = historicalData[historicalData.length - 1];
    const currentDate = new Date(latestDataPoint.date);
    currentDate.setUTCHours(0,0,0,0);

    const datesForMetrics = getPastDates(currentDate);
    const metrics: Record<string, any> = {};
    const periods: Record<string, Date> = {
      '1D': datesForMetrics.oneDayAgo,
      '1W': datesForMetrics.oneWeekAgo,
      '1M': datesForMetrics.oneMonthAgo,
      '3M': datesForMetrics.threeMonthsAgo,
      '6M': datesForMetrics.sixMonthsAgo,
      '1Y': datesForMetrics.oneYearAgo,
    };

    for (const periodKey in periods) {
      const pastDataPoint = findDataPointOnOrBefore(historicalData, periods[periodKey]);
      metrics[periodKey] = calculatePerformance(latestDataPoint.value, pastDataPoint?.value);
      metrics[periodKey].pastDate = pastDataPoint?.date || null;
      metrics[periodKey].pastValue = pastDataPoint?.value || null;
    }
    
    const ytdStartDate = datesForMetrics.lastDayOfPrevYear;
    const ytdStartPoint = findDataPointOnOrBefore(historicalData, ytdStartDate);
    metrics['YTD'] = calculatePerformance(latestDataPoint.value, ytdStartPoint?.value);
    metrics['YTD'].pastDate = ytdStartPoint?.date || null;
    metrics['YTD'].pastValue = ytdStartPoint?.value || null;
    
    // Analytical Metrics (SMAs, 52-week H/L)
    const analyticalMetrics: Record<string, any> = {
      latestSma50: null, latestSma200: null,
      historicalSma50: [], historicalSma200: [],
      yearlyHigh: null, yearlyLow: null,
    };

    const sma50Series = calculateHistoricalSMA(historicalData, 50);
    const sma200Series = calculateHistoricalSMA(historicalData, 200);
    analyticalMetrics.historicalSma50 = sma50Series;
    analyticalMetrics.historicalSma200 = sma200Series;
    if (sma50Series.length > 0) analyticalMetrics.latestSma50 = sma50Series[sma50Series.length - 1].value;
    if (sma200Series.length > 0) analyticalMetrics.latestSma200 = sma200Series[sma200Series.length - 1].value;
    
    const lastYearData = getDataForLastNDays(historicalData, currentDate, 365);
    if (lastYearData.length > 0) {
      let yearlyHigh: DataPoint = lastYearData[0];
      let yearlyLow: DataPoint = lastYearData[0];
      for (const point of lastYearData) {
        if (point.value > yearlyHigh.value) yearlyHigh = point;
        if (point.value < yearlyLow.value) yearlyLow = point;
      }
      analyticalMetrics.yearlyHigh = yearlyHigh;
      analyticalMetrics.yearlyLow = yearlyLow;
    }

    const result = {
      data: {
        seriesInfo: {
          id: coinInfo.id,
          title: coinInfo.name || cryptoId,
          symbol: coinInfo.symbol?.toUpperCase(),
          units_short: vsCurrency.toUpperCase(),
          description: coinInfo.description?.en?.split('. ')[0] + '.',
          frequency_short: 'Daily',
          last_updated: coinInfo.market_data?.last_updated || new Date().toISOString(),
          source_link: coinInfo.links?.homepage?.[0] || `https://www.coingecko.com/en/coins/${cryptoId}`,
        },
        currentValue: {
            date: new Date(coinInfo.market_data?.last_updated || Date.now()).toISOString().split('T')[0],
            value: coinInfo.market_data?.current_price?.[vsCurrency.toLowerCase() as keyof typeof coinInfo.market_data.current_price] || latestDataPoint.value,
        },
        marketCap: coinInfo.market_data?.market_cap?.[vsCurrency.toLowerCase() as keyof typeof coinInfo.market_data.market_cap],
        totalVolume: coinInfo.market_data?.total_volume?.[vsCurrency.toLowerCase() as keyof typeof coinInfo.market_data.total_volume],
        priceChange24hPercent: coinInfo.market_data?.price_change_percentage_24h,
        historical: historicalData,
        metrics,
        analyticalMetrics,
      },
      error: null,
    };
    await setCache(cacheKey, result, 60); // Cache for 60 seconds
    return result;

  } catch (err: any) {
    console.error(`CoinGecko API error for ${cryptoId}:`, err.response?.data || err.message);
    const errorMsg = err.response?.data?.error || err.message || `Failed to fetch data for ${cryptoId}`;
    if (err.response?.status === 429) {
        return { data: null, error: `CoinGecko API rate limit hit. Please try again later. (${errorMsg})` };
    }
    return { data: null, error: errorMsg };
  }
}

// Optional: Function to get a list of top coins (can be used later to dynamically populate MarketsPage)
// export async function getTopCryptocurrencies(vsCurrency: string = 'usd', perPage: number = 10, page: number = 1) {
//   // ... implementation using /coins/markets endpoint ...
// }
