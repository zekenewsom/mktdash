import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SummaryCard, { SnapshotIndicatorItem } from '../components/Home/SummaryCard';
import GaugeChart from '../components/Home/GaugeChart';
import { LineChart, Shield, Activity, Info } from 'lucide-react';
import { Tooltip } from '../components/ui/Tooltip';

interface GaugeData {
  value: number;
  name: string;
  rawValueDisplay?: string;
  unit?: string;
}
interface HomeSnapshotData {
  markets: SnapshotIndicatorItem[];
  economic: SnapshotIndicatorItem[];
  financialStability: SnapshotIndicatorItem[];
  marketGauge?: GaugeData;
  economicGauge?: GaugeData;
  stabilityGauge?: GaugeData;
}


const HomePage: React.FC = () => {
  const [snapshotData, setSnapshotData] = useState<HomeSnapshotData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    axios.get('/api/overview/snapshot')
      .then(res => {
        setSnapshotData(res.data);
        setError(null);
      })
      .catch(err => {
        setError('Failed to fetch snapshot');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex flex-col items-center justify-center min-h-[300px]">Loading dashboard...</div>;
  }
  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }
  if (!snapshotData) {
    return <div className="text-muted-foreground text-center">No data available.</div>;
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Overview Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Market Sentiment Gauge */}
        <div className="bg-card rounded-lg shadow p-4 flex flex-col items-center">
          <div className="font-semibold mb-2 flex items-center gap-2">
            <LineChart className="w-5 h-5 text-primary" /> Market Sentiment
            <Tooltip content="% of S&P 500, Nasdaq, and DJIA with positive daily change.">
              <Info aria-label="Market Sentiment Info" className="w-4 h-4 text-muted-foreground cursor-pointer" tabIndex={0} />
            </Tooltip>
          </div>
          {snapshotData.marketGauge ? (
            <GaugeChart
              value={snapshotData.marketGauge.value}
              name={snapshotData.marketGauge.name}
              rawValueDisplay={snapshotData.marketGauge.rawValueDisplay}
              unit={snapshotData.marketGauge.unit}
              height={200}
            />
          ) : <div className="text-muted-foreground">No data</div>}
        </div>
        {/* Economic Strength Gauge */}
        <div className="bg-card rounded-lg shadow p-4 flex flex-col items-center">
          <div className="font-semibold mb-2 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> Economic Strength
            <Tooltip content="Latest US Real GDP quarterly growth rate (FRED: A191RL1Q225SBEA), normalized.">
              <Info aria-label="Economic Strength Info" className="w-4 h-4 text-muted-foreground cursor-pointer" tabIndex={0} />
            </Tooltip>
          </div>
          {snapshotData.economicGauge ? (
            <GaugeChart
              value={snapshotData.economicGauge.value}
              name={snapshotData.economicGauge.name}
              rawValueDisplay={snapshotData.economicGauge.rawValueDisplay}
              unit={snapshotData.economicGauge.unit}
              height={200}
            />
          ) : <div className="text-muted-foreground">No data</div>}
        </div>
        {/* Financial Stability Gauge */}
        <div className="bg-card rounded-lg shadow p-4 flex flex-col items-center">
          <div className="font-semibold mb-2 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" /> Financial Stability
            <Tooltip content="Moody’s Baa Corporate Bond Yield spread vs 10Y Treasury (FRED: BAA10Y), normalized. Lower = safer.">
              <Info aria-label="Financial Stability Info" className="w-4 h-4 text-muted-foreground cursor-pointer" tabIndex={0} />
            </Tooltip>
          </div>
          {snapshotData.stabilityGauge ? (
            <GaugeChart
              value={snapshotData.stabilityGauge.value}
              name={snapshotData.stabilityGauge.name}
              rawValueDisplay={snapshotData.stabilityGauge.rawValueDisplay}
              unit={snapshotData.stabilityGauge.unit}
              height={200}
            />
          ) : <div className="text-muted-foreground">No data</div>}
        </div>
      </div>

      {/* Existing summary cards below gauges */}
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
