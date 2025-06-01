import React from 'react';
import { Link } from 'react-router-dom';
import MarketOverviewCard from '../components/placeholders/MarketOverviewCard';
import TableContainer from '../components/placeholders/TableContainer';
import NewsFeed from '../components/placeholders/NewsFeed';
import ReportViewer from '../components/placeholders/ReportViewer';
import { Briefcase, TrendingUp, BarChart3, Scale, ShieldAlert, Banknote } from 'lucide-react';

interface MarketIndicatorInfo {
  id: string;
  fredId: string;
  name: string;
  description: string;
  icon?: React.ElementType;
}

const EQUITY_INDICES: MarketIndicatorInfo[] = [
  {
    id: 'sp500',
    fredId: 'SP500',
    name: 'S&P 500',
    description: 'Tracks 500 of the largest U.S. publicly traded companies.',
    icon: Briefcase,
  },
  {
    id: 'nasdaq',
    fredId: 'NASDAQCOM',
    name: 'Nasdaq Composite',
    description: 'Tracks most stocks listed on the Nasdaq exchange, tech-heavy.',
    icon: TrendingUp,
  },
  {
    id: 'djia',
    fredId: 'DJIA',
    name: 'Dow Jones Industrial Average',
    description: 'Tracks 30 large, publicly-owned blue-chip companies.',
    icon: BarChart3,
  },
];

const FIXED_INCOME_INDICATORS: MarketIndicatorInfo[] = [
  {
    id: '10y-treasury',
    fredId: 'DGS10',
    name: '10-Year Treasury Yield',
    description: 'Constant maturity yield on the 10-year U.S. Treasury note.',
    icon: Scale,
  },
  {
    id: '2y-treasury',
    fredId: 'DGS2',
    name: '2-Year Treasury Yield',
    description: 'Constant maturity yield on the 2-year U.S. Treasury note.',
    icon: Scale,
  },
  {
    id: 'yield-curve-10y2y',
    fredId: 'T10Y2Y',
    name: '10Y-2Y Yield Curve Spread',
    description: 'Difference between 10-year and 2-year Treasury yields, an indicator of economic outlook.',
    icon: TrendingUp,
  },
  {
    id: 'aaa-corp-yield',
    fredId: 'AAA',
    name: 'Aaa Corporate Bond Yield',
    description: 'Yield on investment-grade corporate bonds rated Aaa by Moody\'s.',
    icon: ShieldAlert,
  },
  {
    id: 'baa-corp-yield',
    fredId: 'BAA',
    name: 'Baa Corporate Bond Yield',
    description: 'Yield on medium investment-grade corporate bonds rated Baa by Moody\'s.',
    icon: Banknote,
  },
  {
    id: 'high-yield-corp',
    fredId: 'BAMLH0A0HYM2EY',
    name: 'US High Yield Corp. Bond Yield',
    description: 'Effective yield of the U.S. high-yield corporate bond market (junk bonds).',
    icon: TrendingUp,
  },
];

const MarketsPage: React.FC = () => {
  const renderIndicatorCard = (indicator: MarketIndicatorInfo) => {
    const IconComponent = indicator.icon || BarChart3;
    return (
      <Link
        to={`/series/${indicator.fredId}`}
        key={indicator.id}
        className="block p-6 bg-card text-card-foreground rounded-lg shadow hover:shadow-md transition-shadow duration-200 ease-in-out group"
      >
        <div className="flex items-center mb-2">
          <IconComponent className="h-6 w-6 mr-3 text-primary group-hover:text-primary/80 transition-colors" />
          <h3 className="text-lg font-semibold text-primary group-hover:text-primary/80 transition-colors">{indicator.name}</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{indicator.description}</p>
        <div className="mt-3 text-xs text-primary hover:underline group-hover:text-primary/80 transition-colors">
          View Details &rarr;
        </div>
      </Link>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary mb-1">Markets Dashboard</h1>
        <p className="text-muted-foreground">Overview of key market indicators and indices across various asset classes.</p>
      </div>

      <MarketOverviewCard />

      {/* U.S. Equity Indices Section */}
      <section className="pt-2">
        <h2 className="text-2xl font-semibold tracking-tight mb-4 text-foreground">U.S. Equity Indices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {EQUITY_INDICES.map(renderIndicatorCard)}
        </div>
      </section>

      {/* Fixed Income / Bonds Section */}
      <section className="pt-2">
        <h2 className="text-2xl font-semibold tracking-tight mb-4 text-foreground">Fixed Income / Bonds</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FIXED_INCOME_INDICATORS.map(renderIndicatorCard)}
        </div>
      </section>

      <div className="pt-2">
        <TableContainer />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        <div className="lg:col-span-1">
          <NewsFeed />
        </div>
        <div className="lg:col-span-2">
          <ReportViewer />
        </div>
      </div>
    </div>
  );
};

export default MarketsPage;