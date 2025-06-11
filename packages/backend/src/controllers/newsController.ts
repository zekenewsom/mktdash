import { Request, Response } from 'express';
import * as newsService from '../services/newsService';

export async function handleGetMarketNews(req: Request, res: Response): Promise<void> {
  try {
    const { tickers, topics, limit, sort } = req.query;

    const options = {
      tickers: tickers ? (tickers as string).split(',').map(t => t.trim()).filter(t => t) : undefined,
      topics: topics ? (topics as string).split(',').map(t => t.trim()).filter(t => t) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      sort: sort as 'LATEST' | 'RELEVANCE' | undefined,
    };

    if (options.limit && (options.limit < 1 || options.limit > 200)) {
      res.status(400).json({ message: 'Limit parameter must be between 1 and 200.' });
      return;
    }

    const newsData = await newsService.getMarketNews(options);
    res.json(newsData);
  } catch (error: any) {
    console.error('News Controller Error:', error.message);
    if (error.message.includes('Missing API key')) {
      res.status(503).json({ message: 'News service temporarily unavailable.' });
    } else if (error.message.includes('Failed to fetch market news')) {
      res.status(502).json({ message: 'Could not retrieve news from provider.' });
    } else {
      res.status(500).json({ message: 'An error occurred while fetching news.' });
    }
  }
}
