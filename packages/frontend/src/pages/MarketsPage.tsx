import React from 'react';
import { Link } from 'react-router-dom';
import MarketOverviewCard from '../components/placeholders/MarketOverviewCard';
import TableContainer from '../components/placeholders/TableContainer';
import NewsFeed from '../components/placeholders/NewsFeed';
import ReportViewer from '../components/placeholders/ReportViewer';
import { 
  Briefcase, TrendingUp, BarChart3, Scale, ShieldAlert, Banknote, 
  Globe, DollarSign, Fuel, Gem, Leaf, Home as HomeIcon, Building2, Construction, Bitcoin 
} from 'lucide-react';

interface MarketIndicatorInfo {
  id: string;
  apiId: string;
  name: string;
  description: string;
  icon?: React.ElementType;
  type: 'series' | 'crypto';
}

const CURRENCY_INDICATORS: MarketIndicatorInfo[] = [
  {
    id: 'dollar-index', apiId: 'DTWEXBGS', name: 'U.S. Dollar Index (Broad)',
    description: 'Trade Weighted U.S. Dollar Index against a broad group of major U.S. trading partners.', icon: DollarSign, type: 'series',
  },
  {
    id: 'eur-usd', apiId: 'DEXUSEU', name: 'EUR/USD Exchange Rate',
    description: 'U.S. Dollars to One Euro exchange rate.', icon: Globe, type: 'series',
  },
  {
    id: 'usd-jpy', apiId: 'DEXJPUS', name: 'USD/JPY Exchange Rate',
    description: 'Japanese Yen to One U.S. Dollar exchange rate.', icon: Globe, type: 'series',
  },
  {
    id: 'gbp-usd', apiId: 'DEXUSUK', name: 'GBP/USD Exchange Rate',
    description: 'U.S. Dollars to One British Pound exchange rate.', icon: Globe, type: 'series',
  },
  {
    id: 'usd-cny', apiId: 'DEXCHUS', name: 'USD/CNY Exchange Rate',
    description: 'Chinese Yuan Renminbi to One U.S. Dollar exchange rate.', icon: Globe, type: 'series',
  },
];

const COMMODITY_INDICATORS: MarketIndicatorInfo[] = [
  {
    id: 'wti-oil', apiId: 'DCOILWTICO', name: 'Crude Oil (WTI)',
    description: 'West Texas Intermediate crude oil spot price in Cushing, OK.', icon: Fuel, type: 'series',
  },
  {
    id: 'brent-oil', apiId: 'DCOILBRENTEU', name: 'Crude Oil (Brent)',
    description: 'Brent crude oil spot price, a major global oil benchmark.', icon: Fuel, type: 'series',
  },
  {
    id: 'gold', apiId: 'GOLDAMGBD228NLBM', name: 'Gold Price (London PM Fix)',
    description: 'Gold fixing price per troy ounce in U.S. Dollars, London PM fix.', icon: Gem, type: 'series',
  },
  {
    id: 'silver', apiId: 'SLVPRUSD', name: 'Silver Price (London Fix)',
    description: 'Silver fixing price per troy ounce in U.S. Dollars, London fix.', icon: Gem, type: 'series',
  },
  {
    id: 'natural-gas', apiId: 'DHHNGSP', name: 'Natural Gas (Henry Hub)',
    description: 'Henry Hub Natural Gas spot price.', icon: Leaf, type: 'series',
  },
];

const EQUITY_INDICES: MarketIndicatorInfo[] = [
  {
    id: 'sp500', apiId: 'SP500', name: 'S&P 500', description: 'Tracks 500 of the largest U.S. publicly traded companies.', icon: Briefcase, type: 'series',
  },
  {
    id: 'nasdaq', apiId: 'NASDAQCOM', name: 'Nasdaq Composite', description: 'Tracks most stocks listed on the Nasdaq exchange, tech-heavy.', icon: TrendingUp, type: 'series',
  },
  {
    id: 'djia', apiId: 'DJIA', name: 'Dow Jones Industrial Average', description: 'Tracks 30 large, publicly-owned blue-chip companies.', icon: BarChart3, type: 'series',
  },
];

const FIXED_INCOME_INDICATORS: MarketIndicatorInfo[] = [
  {
    id: '10y-treasury', apiId: 'DGS10', name: '10-Year Treasury Yield', description: 'Constant maturity yield on the 10-year U.S. Treasury note.', icon: Scale, type: 'series',
  },
  {
    id: '2y-treasury', apiId: 'DGS2', name: '2-Year Treasury Yield', description: 'Constant maturity yield on the 2-year U.S. Treasury note.', icon: Scale, type: 'series',
  },
  {
    id: 'yield-curve-10y2y', apiId: 'T10Y2Y', name: '10Y-2Y Yield Curve Spread', description: 'Difference between 10-year and 2-year Treasury yields, an indicator of economic outlook.', icon: TrendingUp, type: 'series',
  },
  {
    id: 'aaa-corp-yield', apiId: 'AAA', name: 'Aaa Corporate Bond Yield', description: 'Yield on investment-grade corporate bonds rated Aaa by Moody\'s.', icon: ShieldAlert, type: 'series',
  },
  {
    id: 'baa-corp-yield', apiId: 'BAA', name: 'Baa Corporate Bond Yield', description: 'Yield on medium investment-grade corporate bonds rated Baa by Moody\'s.', icon: Banknote, type: 'series',
  },
  {
    id: 'high-yield-corp', apiId: 'BAMLH0A0HYM2EY', name: 'US High Yield Corp. Bond Yield', description: 'Effective yield of the U.S. high-yield corporate bond market (junk bonds).', icon: TrendingUp, type: 'series',
  },
];

const REAL_ESTATE_INDICATORS: MarketIndicatorInfo[] = [
  {
    id: 'case-shiller-hpi', apiId: 'CSUSHPINSA', name: 'S&P/Case-Shiller U.S. National HPI', description: 'Tracks U.S. residential real estate prices (Not Seasonally Adjusted).', icon: HomeIcon, type: 'series',
  },
  {
    id: 'fhfa-hpi', apiId: 'USSTHPI', name: 'FHFA House Price Index', description: 'Measures average price changes in repeat sales or refinancing on same properties (Seasonally Adjusted).', icon: HomeIcon, type: 'series',
  },
  {
    id: 'new-home-sales', apiId: 'HSN1F', name: 'New Privately-Owned Home Sales', description: 'Total units of new privately-owned housing units sold (Seasonally Adjusted Annual Rate).', icon: Building2, type: 'series',
  },
  {
    id: 'existing-home-sales', apiId: 'EXHOSLUSM495S', name: 'Existing Home Sales', description: 'Total units of existing homes sold (Seasonally Adjusted Annual Rate).', icon: Building2, type: 'series',
  },
  {
    id: 'housing-starts', apiId: 'HOUST', name: 'Housing Starts', description: 'New privately-owned housing units started (Seasonally Adjusted Annual Rate).', icon: Construction, type: 'series',
  },
  {
    id: 'building-permits', apiId: 'PERMIT', name: 'Building Permits', description: 'New privately-owned housing units authorized by building permits (Seasonally Adjusted Annual Rate).', icon: Construction, type: 'series',
  },
  {
    id: 'reit-index', apiId: 'WILLREITIND', name: 'Wilshire US REIT Index', description: 'Tracks performance of U.S. publicly traded Real Estate Investment Trusts.', icon: Building2, type: 'series',
  },
];

const CRYPTO_CURRENCIES: MarketIndicatorInfo[] = [
  {
    id: 'bitcoin', apiId: 'bitcoin', name: 'Bitcoin (BTC)',
    description: 'The first and most well-known decentralized cryptocurrency.', icon: Bitcoin, type: 'crypto',
  },
  {
    id: 'ethereum', apiId: 'ethereum', name: 'Ethereum (ETH)',
    description: 'A decentralized platform for smart contracts and dApps.', icon: Bitcoin, type: 'crypto', // Replace icon if desired
  },
  {
    id: 'cardano', apiId: 'cardano', name: 'Cardano (ADA)',
    description: 'A proof-of-stake blockchain platform for changemakers.', icon: Bitcoin, type: 'crypto', // Replace icon if desired
  },
];

const MarketsPage: React.FC = () => {
  const renderIndicatorCard = (indicator: MarketIndicatorInfo) => {
    const IconComponent = indicator.icon || BarChart3;
    const linkPath = indicator.type === 'crypto' ? `/crypto/${indicator.apiId}` : `/series/${indicator.apiId}`;
    return (
      <Link
        to={linkPath}
        key={indicator.id}
        state={{ type: indicator.type }}
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

      {/* New Currencies (Forex) Section */}
      <section className="pt-2">
        <h2 className="text-2xl font-semibold tracking-tight mb-4 text-foreground">Currencies (Forex)</h2> {/* */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CURRENCY_INDICATORS.map(renderIndicatorCard)}
        </div>
      </section>

      {/* New Commodities Section */}
      <section className="pt-2">
        <h2 className="text-2xl font-semibold tracking-tight mb-4 text-foreground">Commodities</h2> {/* */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COMMODITY_INDICATORS.map(renderIndicatorCard)}
        </div>
      </section>

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

      {/* New Real Estate Market Section */}
      <section className="pt-2">
        <h2 className="text-2xl font-semibold tracking-tight mb-4 text-foreground">Real Estate Market</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {REAL_ESTATE_INDICATORS.map(renderIndicatorCard)}
        </div>
      </section>

      {/* New Cryptocurrencies Section */}
      <section className="pt-2">
        <h2 className="text-2xl font-semibold tracking-tight mb-4 text-foreground">Cryptocurrencies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CRYPTO_CURRENCIES.map(renderIndicatorCard)}
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