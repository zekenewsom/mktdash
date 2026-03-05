import axios from 'axios';

const API_BASE_URL = '/api'; // Vite proxy handles this

export interface FetchNewsOptions {
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

export const fetchNews = async (options: FetchNewsOptions = {}): Promise<NewsArticle[]> => {
  const validOptions = Object.entries(options).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      // @ts-ignore
      acc[key] = Array.isArray(value) ? value.join(',') : value;
    }
    return acc;
  }, {} as Record<string, string | number>);

  const { data } = await axios.get<NewsArticle[]>(`${API_BASE_URL}/news`, {
    params: validOptions,
  });
  return data;
};
