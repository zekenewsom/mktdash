import { Router } from 'express';
import { getMacroData, getMarketIndices, getIndexHistory, getSeriesHistory, getSingleSeriesDetails } from '../controllers/dataController';
import { generateDailyReport } from '../controllers/reportController';
import { getSingleCryptoDetails } from '../controllers/cryptoController';
import { getHomeSnapshot } from '../controllers/overviewController';
import { getCalendarEvents } from '../controllers/calendarController';

const router = Router();

// Home Overview Snapshot
router.get('/overview/snapshot', getHomeSnapshot);

// Placeholder route for fetching macroeconomic data
router.get('/macro', getMacroData);

// Placeholder route for fetching market index performance
router.get('/market-indices', getMarketIndices);
router.get('/market-indices/history', getIndexHistory);
router.get('/history', getSeriesHistory);

// New: Detailed FRED series endpoint
router.get('/series/:seriesId', getSingleSeriesDetails);
// --- NEW CRYPTO ROUTE ---
router.get('/crypto/:cryptoId', getSingleCryptoDetails);

// Economic Calendar Route - NEW
router.get('/calendar/events', getCalendarEvents);

// Placeholder route to trigger daily report generation (can be called manually for testing)
router.post('/report/generate', generateDailyReport);

export default router;