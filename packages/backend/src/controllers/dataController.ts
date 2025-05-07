import { Request, Response } from 'express';

// Placeholder controller for fetching macroeconomic data
export const getMacroData = async (req: Request, res: Response) => {
  console.log('Received request for macro data');
  // In future phases, this will call services to fetch data from FRED, etc.
  // For now, send a placeholder response
  res.status(200).json({
    message: 'Macro data endpoint hit (placeholder)',
    data: {
      // Mock data structure example
      fedFundsRate: 5.25,
      cpi: 3.4,
      unemploymentRate: 3.9,
    },
  });
};

// Placeholder controller for fetching market index performance
export const getMarketIndices = async (req: Request, res: Response) => {
  console.log('Received request for market index data');
  // In future phases, this will call services to fetch data from Alpha Vantage, Yahoo Finance, etc.
  // For now, send a placeholder response
  res.status(200).json({
    message: 'Market indices endpoint hit (placeholder)',
    data: [
      { name: 'S&P 500', value: 5200, change: '+0.5%', changeValue: 26 },
      { name: 'Nasdaq', value: 16300, change: '-0.1%', changeValue: -16 },
      { name: 'Dow Jones', value: 39000, change: '+0.3%', changeValue: 117 },
    ],
  });
};