import React from 'react';
import MarketOverviewCard from '../components/placeholders/MarketOverviewCard';
import ChartContainer from '../components/placeholders/ChartContainer';
import TableContainer from '../components/placeholders/TableContainer';
import NewsFeed from '../components/placeholders/NewsFeed';
import ReportViewer from '../components/placeholders/ReportViewer';
import RegimeStateCard from '../components/intelligence/RegimeStateCard';
import WhatChangedPanel from '../components/intelligence/WhatChangedPanel';

// This page component sets up the basic dashboard layout
import axios from 'axios';
import { MaterialChange, RegimeState } from '../contracts/intelligence';

const SERIES_LABELS: Record<string, string> = {
  SP500: 'S&P 500',
  NASDAQCOM: 'Nasdaq',
  DJIA: 'Dow Jones',
  FEDFUNDS: 'Fed Funds Rate',
  CPIAUCSL: 'CPI',
  UNRATE: 'Unemployment Rate',
};

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
  const [intelligenceLoading, setIntelligenceLoading] = React.useState(false);
  const [intelligenceError, setIntelligenceError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLoading(true);
    setError(null);
    axios
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
    setIntelligenceLoading(true);
    setIntelligenceError(null);

    axios
      .get('/api/intelligence/overview')
      .then((res) => {
        const payload = res.data?.data || res.data;
        const apiRegime = payload?.regime;
        const apiChanges = payload?.changes || [];

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

        setRegime(mappedRegime);
        setChanges(mappedChanges);
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
    <div className="container mx-auto p-4">
      {/* Tier-1 intelligence row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
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

      {/* All other widgets in a grid below the chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Data Table */}
        <div className="lg:col-span-3">
          <TableContainer
            onSelectIndex={handleSelectSeries}
            selectedIndex={selectedSeries}
          />
        </div>
        {/* News Feed */}
        <div className="lg:col-span-1">
          <NewsFeed />
        </div>
      </div>

      {/* Report Viewer (example layout: spans 3 columns, or could be in a modal) */}
       <div className="lg:col-span-3">
        <ReportViewer />
      </div>

      {/* Add more placeholder widgets here as needed */}
    </div>
  );
};

export default DashboardPage;