import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useIndicatorDetails, IndicatorData } from '../hooks/useIndicatorDetails';
import NewIndexChart from '../components/NewIndexChart';

import IndicatorHeader from '../components/Indicator/IndicatorHeader';
import IndicatorMetricsTable from '../components/Indicator/IndicatorMetricsTable';
import IndicatorAnalyticsPanel from '../components/Indicator/IndicatorAnalyticsPanel';
import { Button } from "../components/ui/button";
import { ArrowLeft } from 'lucide-react';


const IndicatorDetailPage: React.FC = () => {
  const location = useLocation();
  const { seriesId } = useParams<{ seriesId: string }>();
  // Determine indicator type (series or crypto)
  const routeType = location.state?.type as 'series' | 'crypto' | undefined;
  // Heuristic fallback: if id is all lowercase and matches a known crypto, treat as crypto
  const knownCryptos = ['bitcoin', 'ethereum', 'cardano'];
  const inferredType = routeType || (seriesId && knownCryptos.includes(seriesId.toLowerCase()) ? 'crypto' : 'series');
  const navigate = useNavigate();

  const { data, isLoading, error } = useIndicatorDetails(seriesId || '', inferredType) as { data: IndicatorData | null; isLoading: boolean; error: string | null };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64 text-muted-foreground">Loading indicator details...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive-foreground rounded-lg shadow">
        <h2 className="text-xl font-semibold">Error</h2>
        <p>{error}</p>
        <Button onClick={() => navigate(-1)} variant="outline" className="mt-4">Go Back</Button>
      </div>
    );
  }

  if (!data) {
    return <div className="text-center p-4 text-muted-foreground">No data available for this indicator.</div>;
  }

  const chartData = data.historical || [];
  const chartName = data.seriesInfo?.title || data.seriesInfo?.name || seriesId || 'Indicator';

  return (
    <div className="space-y-6">
      <Button onClick={() => navigate(-1)} variant="outline" size="sm" className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Overview
      </Button>
      <IndicatorHeader
        seriesInfo={data.seriesInfo}
        currentValue={data.currentValue}
        seriesId={seriesId || 'N/A'}
      />


      <div className="bg-card p-1 rounded-lg shadow">
        <NewIndexChart
          data={chartData as { date: string; value: number }[]}
          indexName={chartName}
          sma50Data={Array.isArray(data.analyticalMetrics?.historicalSma50) ? data.analyticalMetrics?.historicalSma50 : undefined}
          sma200Data={Array.isArray(data.analyticalMetrics?.historicalSma200) ? data.analyticalMetrics?.historicalSma200 : undefined}
          loading={false}
          error={null}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IndicatorMetricsTable metrics={data.metrics} />
        <IndicatorAnalyticsPanel metrics={{
          sma50: data.analyticalMetrics?.latestSma50,
          sma200: data.analyticalMetrics?.latestSma200,
          yearlyHigh: data.analyticalMetrics?.yearlyHigh,
          yearlyLow: data.analyticalMetrics?.yearlyLow,
        }} />
      </div>
      {data.seriesInfo?.notes && (
        <div className="p-4 bg-card text-card-foreground rounded-lg shadow mt-6">
          <h3 className="text-lg font-semibold mb-2 text-primary">Notes</h3>
          <div className="text-sm prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: data.seriesInfo.notes }} />
        </div>
      )}
    </div>
  );
};

export default IndicatorDetailPage;
