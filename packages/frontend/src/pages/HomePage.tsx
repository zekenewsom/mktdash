import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SummaryCard, { SnapshotIndicatorItem } from '../components/Home/SummaryCard';
import { LineChart, Shield, Activity } from 'lucide-react';

interface HomeSnapshotData {
  markets: SnapshotIndicatorItem[];
  economic: SnapshotIndicatorItem[];
  financialStability: SnapshotIndicatorItem[];
}

const HomePage: React.FC = () => {
  const [snapshotData, setSnapshotData] = useState<HomeSnapshotData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSnapshot = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<HomeSnapshotData>('/api/overview/snapshot');
        setSnapshotData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || 'Failed to load snapshot data.');
        console.error("Error fetching snapshot:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSnapshot();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-[calc(100vh-10rem)] text-muted-foreground">Loading dashboard overview...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-destructive">{error}</div>;
  }

  if (!snapshotData) {
    return <div className="text-center p-10 text-muted-foreground">No snapshot data available.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome to mktdash</h1>
        <p className="text-lg text-muted-foreground">Your central hub for market analytics and economic insights.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SummaryCard
          title="Market Snapshot"
          icon={LineChart}
          indicators={snapshotData.markets.map(m => ({...m, linkType: m.id === 'DCOILWTICO' || m.id === 'DGS10' ? 'series' : 'series'}))}
          viewMoreLink="/markets"
        />
        <SummaryCard
          title="Economic Pulse"
          icon={Activity}
          indicators={snapshotData.economic.map(e => ({...e, linkType: 'series'}))}
          viewMoreLink="/economic"
        />
        <SummaryCard
          title="Financial Stability Overview"
          icon={Shield}
          indicators={snapshotData.financialStability.map(fs => ({...fs, linkType: 'series'}))}
          viewMoreLink="/stability"
        />
      </div>

      <div className="mt-12 p-6 bg-card rounded-lg shadow">
        <h2 className="text-xl font-semibold text-primary mb-3">Explore More</h2>
        <p className="text-muted-foreground">
          Dive deeper into specific indicators, customize your views, or generate detailed reports from each dashboard.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
