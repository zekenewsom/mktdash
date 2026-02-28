import { Router } from 'express';
import { getMacroData, getMarketIndices, getIndexHistory, getSeriesHistory, getDataQuality, getBackendStatus, getRequestMetrics } from '../controllers/dataController';
import { generateDailyReport } from '../controllers/reportController';
import { getIntelligenceOverview } from '../controllers/intelligenceController';
import { getEconomicCalendar } from '../controllers/calendarController';
import { getOpenApiSpec } from '../controllers/docsController';
import { getHeadlineIntelligence } from '../controllers/headlineController';

const router = Router();

// Placeholder route for fetching macroeconomic data
router.get('/macro', getMacroData);

// Placeholder route for fetching market index performance
router.get('/market-indices', getMarketIndices);
router.get('/market-indices/history', getIndexHistory);
router.get('/history', getSeriesHistory);
router.get('/intelligence/overview', getIntelligenceOverview);
router.get('/health/status', getBackendStatus);
router.get('/health/metrics', getRequestMetrics);
router.get('/health/data-quality', getDataQuality);
router.get('/calendar/events', getEconomicCalendar);
router.get('/intelligence/headlines', getHeadlineIntelligence);
router.get('/docs/openapi', getOpenApiSpec);

// Placeholder route to trigger daily report generation (can be called manually for testing)
router.post('/report/generate', generateDailyReport);

export default router;