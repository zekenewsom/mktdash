import React from 'react';
import MarketOverviewCard from '../components/placeholders/MarketOverviewCard';
import ChartContainer from '../components/placeholders/ChartContainer';
import TableContainer from '../components/placeholders/TableContainer';
import NewsFeed from '../components/placeholders/NewsFeed';
import ReportViewer from '../components/placeholders/ReportViewer';

// This page component sets up the basic dashboard layout
import axios from 'axios';

const SERIES_LABELS: Record<string, string> = {
  SP500: 'S&P 500',
  NASDAQCOM: 'Nasdaq',
  DJIA: 'Dow Jones',
  FEDFUNDS: 'Fed Funds Rate',
  CPIAUCSL: 'CPI',
  UNRATE: 'Unemployment Rate',
};

const MarketsPage: React.FC = () => {
  // In future phases, state management for widget layout will go here
  // For now, use a simple grid structure

  // State for chart selection and data
  const [selectedSeries, setSelectedSeries] = React.useState<string>('SP500');
  const [seriesHistory, setSeriesHistory] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

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

  // Handler for selecting index from child components
  const handleSelectSeries = (series: string) => {
    setSelectedSeries(series);
    setError(null);
  };

  return (
    <div className="container mx-auto p-4">
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

export default MarketsPage;