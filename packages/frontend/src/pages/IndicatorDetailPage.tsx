import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import NewIndexChart from '../components/NewIndexChart';

import IndicatorHeader from '../components/Indicator/IndicatorHeader';
import IndicatorMetricsTable from '../components/Indicator/IndicatorMetricsTable';
import IndicatorAnalyticsPanel from '../components/Indicator/IndicatorAnalyticsPanel';
import { Button } from "../components/ui/button";
import { ArrowLeft } from 'lucide-react';

interface AnalyticalMetricsData {
  latestSma50?: number | null;
  latestSma200?: number | null;
  historicalSma50?: { date: string; value: number }[] | null;
  historicalSma200?: { date: string; value: number }[] | null;
  yearlyHigh?: { date: string; value: number } | null;
  yearlyLow?: { date: string; value: number } | null;
}

interface SeriesData {
  seriesInfo?: any;
  currentValue?: { date: string; value: number };
  historical?: { date: string; value: number }[];
  metrics?: any;
  analyticalMetrics?: AnalyticalMetricsData;
}

const IndicatorDetailPage: React.FC = () => {
  const location = useLocation();
  const { seriesId } = useParams<{ seriesId: string }>();
  // Determine indicator type (series or crypto)
  const routeType = location.state?.type as 'series' | 'crypto' | undefined;
  // Heuristic fallback: if id is all lowercase and matches a known crypto, treat as crypto
  const knownCryptos = ['bitcoin', 'ethereum', 'cardano'];
  const inferredType = routeType || (seriesId && knownCryptos.includes(seriesId.toLowerCase()) ? 'crypto' : 'series');
  const navigate = useNavigate();
  const [seriesData, setSeriesData] = useState<SeriesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!seriesId) {
      setError('Series ID is missing.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let response;
        if (inferredType === 'crypto') {
          response = await axios.get(`/api/crypto/${seriesId}`);
        } else {
          response = await axios.get(`/api/series/${seriesId}`);
        }
        if (response.data.error && !response.data.data) {
          setError(response.data.error);
          setSeriesData(null);
        } else {
          setSeriesData(response.data.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || `Failed to fetch data for ${seriesId}`);
        setSeriesData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [seriesId, inferredType]);

  if (loading) {
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

  if (!seriesData) {
    return <div className="text-center p-4 text-muted-foreground">No data available for this indicator.</div>;
  }

  const chartData = seriesData.historical || [];
  const chartName = seriesData.seriesInfo?.title || seriesData.seriesInfo?.name || seriesId || 'Indicator';

  return (
    <div className="space-y-6">
      <Button onClick={() => navigate(-1)} variant="outline" size="sm" className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Overview
      </Button>
      <IndicatorHeader
        seriesInfo={seriesData.seriesInfo}
        currentValue={seriesData.currentValue}
        seriesId={seriesId || 'N/A'}
      />


      <div className="bg-card p-1 rounded-lg shadow">
        <NewIndexChart
          data={chartData as { date: string; value: number }[]}
          indexName={chartName}
          sma50Data={Array.isArray(seriesData.analyticalMetrics?.historicalSma50) ? seriesData.analyticalMetrics?.historicalSma50 : undefined}
          sma200Data={Array.isArray(seriesData.analyticalMetrics?.historicalSma200) ? seriesData.analyticalMetrics?.historicalSma200 : undefined}
          loading={false}
          error={null}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IndicatorMetricsTable metrics={seriesData.metrics} />
        <IndicatorAnalyticsPanel metrics={{
          sma50: seriesData.analyticalMetrics?.latestSma50,
          sma200: seriesData.analyticalMetrics?.latestSma200,
          yearlyHigh: seriesData.analyticalMetrics?.yearlyHigh,
          yearlyLow: seriesData.analyticalMetrics?.yearlyLow,
        }} />
      </div>
      {seriesData.seriesInfo?.notes && (
        <div className="p-4 bg-card text-card-foreground rounded-lg shadow mt-6">
          <h3 className="text-lg font-semibold mb-2 text-primary">Notes</h3>
          <div className="text-sm prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: seriesData.seriesInfo.notes }} />
        </div>
      )}
    </div>
  );
};

export default IndicatorDetailPage;
