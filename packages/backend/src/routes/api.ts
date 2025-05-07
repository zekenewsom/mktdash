import { Router } from 'express';
import { getMacroData, getMarketIndices } from '../controllers/dataController';
import { generateDailyReport } from '../controllers/reportController';

const router = Router();

// Placeholder route for fetching macroeconomic data
router.get('/macro', getMacroData);

// Placeholder route for fetching market index performance
router.get('/market-indices', getMarketIndices);

// Placeholder route to trigger daily report generation (can be called manually for testing)
router.post('/report/generate', generateDailyReport);

export default router;