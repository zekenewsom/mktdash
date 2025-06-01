import { Request, Response } from 'express';
import { getCryptoDetails } from '../services/coinGeckoService';

export const getSingleCryptoDetails = async (req: Request, res: Response) => {
  const { cryptoId } = req.params;
  const vsCurrency = (req.query.vs_currency as string) || 'usd';
  let days = (req.query.days as string) || '365';
  if (!days || days === 'max' || days === 'all') days = '365';

  if (!cryptoId) {
    return res.status(400).json({ error: 'Missing cryptoId path parameter' });
  }

  try {
    const result = await getCryptoDetails(cryptoId, vsCurrency, days);
    if (result.error && !result.data) {
      const errorMsg = typeof result.error === 'string'
        ? result.error
        : (result.error?.error?.status?.error_message || JSON.stringify(result.error));
      if (errorMsg.includes("API rate limit hit")) {
        return res.status(429).json({ error: errorMsg, data: null });
      }
      return res.status(500).json({ error: errorMsg, data: null });
    }
    return res.status(200).json(result);
  } catch (err: any) {
    console.error(`Controller error for getSingleCryptoDetails ${cryptoId}:`, err);
    return res.status(500).json({ error: err.message || 'Unknown server error', data: null });
  }
};
