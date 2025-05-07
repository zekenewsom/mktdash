import { Router } from 'express';
import { getMacroData, getMarketIndices, getIndexHistory, getSeriesHistory } from '../controllers/dataController';
import { generateDailyReport } from '../controllers/reportController';

const router = Router();

// Placeholder route for fetching macroeconomic data
router.get('/macro', getMacroData);

// Placeholder route for fetching market index performance
router.get('/market-indices', getMarketIndices);
router.get('/market-indices/history', getIndexHistory);
router.get('/history', getSeriesHistory);

// Placeholder route to trigger daily report generation (can be called manually for testing)
router.post('/report/generate', generateDailyReport);

export default router;