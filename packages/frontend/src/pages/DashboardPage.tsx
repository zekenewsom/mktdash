import React from 'react';
import MarketOverviewCard from '../components/placeholders/MarketOverviewCard';
import ChartContainer from '../components/placeholders/ChartContainer';
const ReportViewer = React.lazy(() => import('../components/placeholders/ReportViewer'));
import RegimeStateCard from '../components/intelligence/RegimeStateCard';
import WhatChangedPanel from '../components/intelligence/WhatChangedPanel';
import InvalidationPanel from '../components/intelligence/InvalidationPanel';
import HeadlineIntelligenceFeed from '../components/intelligence/HeadlineIntelligenceFeed';
import DataQualityConsole from '../components/intelligence/DataQualityConsole';
import EconomicCalendar from '../components/intelligence/EconomicCalendar';
import CrossAssetConfirmationMatrix, { CrossAssetRow } from '../components/intelligence/CrossAssetConfirmationMatrix';

// This page component sets up the basic dashboard layout
import apiClient from '../lib/apiClient';
import { InvalidationTrigger, MaterialChange, RegimeState } from '../contracts/intelligence';

const SERIES_LABELS: Record<string, string> = {
  SP500: 'S&P 500',
  NASDAQCOM: 'Nasdaq',
  DJIA: 'Dow Jones',
  FEDFUNDS: 'Fed Funds Rate',
  CPIAUCSL: 'CPI',
  UNRATE: 'Unemployment Rate',
};

function mapMatrixRowsFromRegime(regimeState: RegimeState): CrossAssetRow[] {
  const expectedRiskDirection = regimeState.state === 'risk_off' ? 'down' : regimeState.state === 'risk_on' ? 'up' : 'flat';

  const baseRows: CrossAssetRow[] = regimeState.drivers.map((driver) => {
    const confirmation: CrossAssetRow['confirmation'] =
      driver.direction === expectedRiskDirection
        ? 'confirm'
        : driver.direction === 'flat'
          ? 'neutral'
          : 'diverge';

    return {
      asset: driver.label,
      signal: driver.direction,
      confirmation,
      note: `${driver.impact} impact vs ${regimeState.state.replace('_', ' ')} regime`,
    };
  });

  if (baseRows.length >= 4) return baseRows;

  return [
    ...baseRows,
    { asset: 'Credit (HY spreads)', signal: 'flat' as const, confirmation: 'neutral' as const, note: 'Awaiting live credit integration' },
    { asset: 'Volatility (VIX/MOVE)', signal: 'flat' as const, confirmation: 'neutral' as const, note: 'Awaiting live vol integration' },
    { asset: 'Commodities (WTI/Gold)', signal: 'flat' as const, confirmation: 'neutral' as const, note: 'Awaiting live commodity integration' },
  ].slice(0, 6);
}

const DashboardPage: React.FC = () => {
  // In future phases, state management for widget layout will go here
  // For now, use a simple grid structure

  // State for chart selection and data
  const [selectedSeries, setSelectedSeries] = React.useState<string>('SP500');
  const [seriesHistory, setSeriesHistory] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [regime, setRegime] = React.useState<RegimeState | null>(null);
  const [changes, setChanges] = React.useState<MaterialChange[]>([]);
  const [invalidations, setInvalidations] = React.useState<InvalidationTrigger[]>([]);
  const [matrixRows, setMatrixRows] = React.useState<CrossAssetRow[]>([]);
  const [intelligenceLoading, setIntelligenceLoading] = React.useState(false);
  const [intelligenceError, setIntelligenceError] = React.useState<string | null>(null);
  const [backendHeartbeat, setBackendHeartbeat] = React.useState<'ok' | 'degraded'>('degraded');
  const [isOnline, setIsOnline] = React.useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  React.useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  React.useEffect(() => {
    setLoading(true);
    setError(null);
    apiClient
      .get(`/api/history?series=${selectedSeries}`)
      .then((res) => {
        setSeriesHistory(res.data.data || res.data);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load history');
      })
      .finally(() => setLoading(false));
  }, [selectedSeries]);

  React.useEffect(() => {
    apiClient
      .get('/api/health/status')
      .then((res) => {
        const status = res.data?.data?.status || res.data?.status;
        setBackendHeartbeat(status === 'ok' ? 'ok' : 'degraded');
      })
      .catch(() => setBackendHeartbeat('degraded'));
  }, []);

  React.useEffect(() => {
    setIntelligenceLoading(true);
    setIntelligenceError(null);

    apiClient
      .get('/api/intelligence/overview')
      .then((res) => {
        const payload = res.data?.data || res.data;
        const apiRegime = payload?.regime;
        const apiChanges = payload?.changes || [];
        const apiInvalidations = payload?.invalidations || [];

        if (!apiRegime) {
          throw new Error('Missing regime payload');
        }

        const mappedRegime: RegimeState = {
          state: apiRegime.state,
          score: apiRegime.score,
          confidence: apiRegime.confidence,
          drivers: apiRegime.drivers || [],
          quality: {
            confidence: apiRegime.quality?.confidence || apiRegime.confidence,
            asOf: apiRegime.quality?.as_of || new Date().toISOString(),
            source: apiRegime.quality?.source || 'unknown',
            isFallback: Boolean(apiRegime.quality?.quality_flags?.fallback),
            qualityFlags: apiRegime.quality?.quality_flags
              ? Object.keys(apiRegime.quality.quality_flags).filter((k) => apiRegime.quality.quality_flags[k])
              : [],
          },
        };

        const mappedChanges: MaterialChange[] = apiChanges.map((item: any) => ({
          id: item.id,
          title: item.title,
          detail: item.detail,
          category: item.category,
          direction: item.direction,
          magnitude: item.magnitude,
          asOf: item.as_of || new Date().toISOString(),
          confidence: item.confidence || mappedRegime.confidence,
        }));

        const mappedInvalidations: InvalidationTrigger[] = apiInvalidations.map((item: any) => ({
          id: item.id,
          label: item.label,
          metric: item.metric,
          threshold: item.threshold,
          status: item.status,
          sensitivity: item.sensitivity,
          asOf: item.as_of || new Date().toISOString(),
          confidence: item.confidence || mappedRegime.confidence,
        }));

        setRegime(mappedRegime);
        setChanges(mappedChanges);
        setInvalidations(mappedInvalidations);
        setMatrixRows(mapMatrixRowsFromRegime(mappedRegime));
      })
      .catch((err) => {
        setIntelligenceError(err.message || 'Failed to load intelligence overview');
      })
      .finally(() => setIntelligenceLoading(false));
  }, []);

  // Handler for selecting index from child components
  const handleSelectSeries = (series: string) => {
    setSelectedSeries(series);
    setError(null);
  };

  return (
    <main className="container mx-auto p-2 md:p-4" aria-label="mktdash dashboard">
      <div className="mb-3 text-xs flex flex-wrap gap-2">
        <span className={`inline-flex items-center rounded px-2 py-1 ${backendHeartbeat === 'ok' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          backend: {backendHeartbeat}
        </span>
        <span className={`inline-flex items-center rounded px-2 py-1 ${isOnline ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
          network: {isOnline ? 'online' : 'offline'}
        </span>
      </div>

      {!isOnline && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          You appear offline. Dashboard data may be stale until connection is restored.
        </div>
      )}

      {/* Tier-1 intelligence row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {intelligenceLoading && (
          <div className="lg:col-span-2 bg-card text-card-foreground rounded-lg shadow p-4">
            Loading intelligence overview...
          </div>
        )}

        {!intelligenceLoading && intelligenceError && (
          <div className="lg:col-span-2 bg-card text-card-foreground rounded-lg shadow p-4 text-red-600">
            Error loading intelligence overview: {intelligenceError}
          </div>
        )}

        {!intelligenceLoading && !intelligenceError && regime && (
          <>
            <RegimeStateCard regime={regime} />
            <WhatChangedPanel changes={changes} />
            <InvalidationPanel triggers={invalidations} />
          </>
        )}
      </div>

      {/* Market Overview: Top of the dashboard */}
      <div className="w-full mb-6">
        <MarketOverviewCard
          onSelectIndex={handleSelectSeries}
          selectedIndex={selectedSeries}
        />
      </div>
      {/* Chart: Full width, just below Market Overview */}
      <div className="w-full mb-6">
        <ChartContainer
          data={seriesHistory}
          loading={loading}
          error={error}
          indexName={SERIES_LABELS[selectedSeries] || selectedSeries}
        />
      </div>

      <div className="mb-2 mt-2 text-sm font-semibold text-slate-700">Intelligence Context</div>

      {/* All other widgets in a grid below the chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Cross-asset confirmation matrix */}
        <div className="lg:col-span-3">
          <CrossAssetConfirmationMatrix rows={matrixRows.length ? matrixRows : undefined} />
        </div>
        {/* Economic calendar + quality console */}
        <div className="lg:col-span-2">
          <EconomicCalendar />
        </div>
        <div className="lg:col-span-1">
          <DataQualityConsole />
        </div>
        <div className="lg:col-span-3">
          <HeadlineIntelligenceFeed />
        </div>
      </div>

      {/* Report Viewer (example layout: spans 3 columns, or could be in a modal) */}
      <div className="lg:col-span-3">
        <React.Suspense fallback={<div className="text-sm text-muted-foreground">Loading report module...</div>}>
          <ReportViewer />
        </React.Suspense>
      </div>

      {/* Add more placeholder widgets here as needed */}
    </main>
  );
};

export default DashboardPage;