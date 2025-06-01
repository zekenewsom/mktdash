import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import IndexChart from '../components/IndexChart';
import IndicatorHeader from '../components/Indicator/IndicatorHeader';
import IndicatorMetricsTable from '../components/Indicator/IndicatorMetricsTable';
import IndicatorAnalyticsPanel from '../components/Indicator/IndicatorAnalyticsPanel';
import { Button } from "../components/ui/button";
import { ArrowLeft } from 'lucide-react';

interface DataPointValue {
  date: string;
  value: number;
}
interface AnalyticalMetricsData {
  sma50?: number | null;
  sma200?: number | null;
  yearlyHigh?: DataPointValue | null;
  yearlyLow?: DataPointValue | null;
}

interface SeriesData {
  seriesInfo?: any;
  currentValue?: { date: string; value: number };
  historical?: { date: string; value: number }[];
  metrics?: any;
  analyticalMetrics?: AnalyticalMetricsData;
}

const IndicatorDetailPage: React.FC = () => {
  const { seriesId } = useParams<{ seriesId: string }>();
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
        const response = await axios.get(`/api/series/${seriesId}`);
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
  }, [seriesId]);

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
  const chartName = seriesData.seriesInfo?.title || seriesId || 'Indicator';

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
         <IndexChart
            data={chartData}
            indexName={chartName}
            loading={false}
            error={null}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IndicatorMetricsTable metrics={seriesData.metrics} />
        <IndicatorAnalyticsPanel metrics={seriesData.analyticalMetrics} />
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
