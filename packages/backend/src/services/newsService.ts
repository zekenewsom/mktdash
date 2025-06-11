import { getClient } from '../utils/redis';
import { fetchWithRetry } from '../utils/fetchWithRetry';
import { URLSearchParams } from 'url';

const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';
const API_KEY = process.env.ALPHAVANTAGE_API_KEY;
const NEWS_CACHE_TTL_SECONDS = 60 * 10; // 10 minutes

export interface NewsQueryOptions {
  tickers?: string[];
  topics?: string[];
  limit?: number;
  sort?: 'LATEST' | 'RELEVANCE';
}

export interface NewsArticle {
  title: string;
  url: string;
  time_published: string;
  summary: string;
  banner_image: string;
  source: string;
  source_domain: string;
  overall_sentiment_score: number;
  overall_sentiment_label: string;
  topics: Array<{ topic: string; relevance_score: string }>;
  ticker_sentiment: Array<{
    ticker: string;
    relevance_score: string;
    ticker_sentiment_score: string;
    ticker_sentiment_label: string;
  }>;
}

export async function getMarketNews(options: NewsQueryOptions): Promise<NewsArticle[]> {
  if (!API_KEY) {
    console.error('Alpha Vantage API key is not configured.');
    throw new Error('News service is not available due to missing API key.');
  }

  const { tickers, topics, limit = 50, sort = 'LATEST' } = options;

  const tickerStr = tickers?.join(',') || 'all';
  const topicStr = topics?.join(',') || 'all';
  const cacheKey = `news:${tickerStr}:${topicStr}:${limit}:${sort}`;

  const redisClient = getClient();
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData) as NewsArticle[];
    }
  } catch (err) {
    console.error('Redis error while getting news cache:', err);
  }

  const params = new URLSearchParams({
    function: 'NEWS_SENTIMENT',
    apikey: API_KEY,
    limit: limit.toString(),
    sort,
  });

  if (tickers && tickers.length > 0) {
    params.append('tickers', tickers.join(','));
  }
  if (topics && topics.length > 0) {
    params.append('topics', topics.join(','));
  }

  try {
    const response = await fetchWithRetry(ALPHA_VANTAGE_BASE_URL, { params });
    const responseData = response.data;

    if (responseData.Information || responseData.Note) {
      console.warn(`Alpha Vantage API message: ${responseData.Information || responseData.Note}`);
    }

    const feed: NewsArticle[] = responseData.feed || [];

    try {
      await redisClient.set(cacheKey, JSON.stringify(feed), 'EX', NEWS_CACHE_TTL_SECONDS);
    } catch (err) {
      console.error('Redis error while setting news cache:', err);
    }
    return feed;
  } catch (error: any) {
    console.error('Error fetching news from Alpha Vantage:', error.message);
    if (error.response) {
      console.error('Alpha Vantage Error Response:', error.response.data);
    }
    throw new Error('Failed to fetch market news from provider.');
  }
}
