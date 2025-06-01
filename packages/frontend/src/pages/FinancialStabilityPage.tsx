import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Landmark, Home, BarChartHorizontalBig, AlertTriangle, Car, Ban, Scale, ShieldCheck, Building, LandPlot, Droplets, Filter, FileText, Banknote as MoneyIcon } from 'lucide-react';

interface StabilityIndicatorInfo {
  id: string;
  name: string;
  description: string;
  categoryKey: string;
  categoryDisplay: string;
  icon?: React.ElementType;
  fredId?: string;
}

const STABILITY_CATEGORIES: { key: string; display: string; emoji?: string; }[] = [
  { key: 'interestRates', display: 'Interest Rates Monitor', emoji: '🚨' },
  { key: 'defaultRates', display: 'Default & Delinquency Monitor', emoji: '📉' },
  { key: 'debtRatios', display: 'Debt Ratios Monitor', emoji: '⚖️' },
  { key: 'assetValues', display: 'Asset Valuations Monitor (Stability Lens)', emoji: '🏘️' },
  { key: 'liquidity', display: 'Liquidity Monitor', emoji: '💧' },
];

const STABILITY_INDICATORS: StabilityIndicatorInfo[] = [
  // Category: Interest Rates Monitor
  {
    id: 'fedfunds',
    name: 'Federal Funds Effective Rate',
    description: 'The target rate set by the FOMC for interbank lending of reserves.',
    categoryKey: 'interestRates',
    categoryDisplay: 'Interest Rates Monitor',
    icon: Landmark,
    fredId: 'FEDFUNDS',
  },
  {
    id: '10y-treasury',
    name: '10-Year Treasury Yield',
    description: 'Yield on the 10-year U.S. Treasury note, a benchmark for long-term interest rates.',
    categoryKey: 'interestRates',
    categoryDisplay: 'Interest Rates Monitor',
    icon: TrendingUp,
    fredId: 'DGS10',
  },
  {
    id: 'corp-bond-yield',
    name: 'US Corporate Bond Effective Yield',
    description: 'ICE BofA US Corporate Index Effective Yield, representing investment-grade corporate debt.',
    categoryKey: 'interestRates',
    categoryDisplay: 'Interest Rates Monitor',
    icon: BarChartHorizontalBig,
    fredId: 'BAMLC0A0CM',
  },
  {
    id: 'mortgage-30y',
    name: '30-Year Fixed Mortgage Rate',
    description: 'Average rate for a 30-year fixed-rate mortgage in the U.S.',
    categoryKey: 'interestRates',
    categoryDisplay: 'Interest Rates Monitor',
    icon: Home,
    fredId: 'MORTGAGE30US',
  },

  // Category: Default & Delinquency Monitor
  {
    id: 'cc-delinquency',
    name: 'Credit Card Delinquency Rate',
    description: 'Delinquency rate on credit card loans from all commercial banks.',
    categoryKey: 'defaultRates',
    categoryDisplay: 'Default & Delinquency Monitor',
    icon: AlertTriangle,
    fredId: 'DRCCLACBS',
  },
  {
    id: 'auto-delinquency',
    name: 'Auto Loan Delinquency Rate',
    description: 'Delinquency rate on auto loans from all commercial banks.',
    categoryKey: 'defaultRates',
    categoryDisplay: 'Default & Delinquency Monitor',
    icon: Car,
    fredId: 'DRALACBS',
  },
  {
    id: 'mortgage-delinquency',
    name: 'Mortgage Delinquency Rate',
    description: 'Delinquency rate on single-family residential mortgages.',
    categoryKey: 'defaultRates',
    categoryDisplay: 'Default & Delinquency Monitor',
    icon: Home,
    fredId: 'DRSFRMACBS',
  },
  {
    id: 'bank-npl-ratio',
    name: 'Bank Non-Performing Loans Ratio',
    description: 'Nonperforming loans (90+ days past due + nonaccrual) to total loans for U.S. banks.',
    categoryKey: 'defaultRates',
    categoryDisplay: 'Default & Delinquency Monitor',
    icon: Ban,
    fredId: 'USNIM',
  },

  // Category: Debt Ratios Monitor (High Debt-to-Income Ratios)
  {
    id: 'household-dsr',
    name: 'Household Debt Service Ratio',
    description: 'Household debt service payments as a percent of disposable personal income.',
    categoryKey: 'debtRatios',
    categoryDisplay: 'Debt Ratios Monitor',
    icon: Home, // Icon for household related
    fredId: 'TDSP',
  },
  {
    id: 'federal-debt-gdp',
    name: 'Federal Debt to GDP Ratio',
    description: 'Federal debt held by the public as a percentage of Gross Domestic Product.',
    categoryKey: 'debtRatios',
    categoryDisplay: 'Debt Ratios Monitor',
    icon: Scale, // Icon for ratio/balance
    fredId: 'FYGFGDQ188S', // Federal Debt Held by the Public as Percent of GDP
  },
  {
    id: 'total-public-debt-gdp',
    name: 'Total Public Debt to GDP Ratio',
    description: 'Total public debt as a percentage of Gross Domestic Product.',
    categoryKey: 'debtRatios',
    categoryDisplay: 'Debt Ratios Monitor',
    icon: Landmark, // Icon for government related
    fredId: 'GFDEGDQ188S',
  },
  {
    id: 'corp-debt-level',
    name: 'Nonfinancial Corporate Debt Level',
    description: 'Levels of debt securities and loans for nonfinancial corporate businesses. (Note: Debt-to-EBITDA ratio is hard to source freely).',
    categoryKey: 'debtRatios',
    categoryDisplay: 'Debt Ratios Monitor',
    icon: Building, // Icon for corporate
    fredId: 'NCBDBILQ027S',
  },
  // Category: Asset Valuations Monitor (Stability Lens)
  {
    id: 'sp500-stability',
    name: 'S&P 500 (Valuation)',
    description: 'Broad U.S. equity market performance, monitored for sharp declines or overvaluation.',
    categoryKey: 'assetValues',
    categoryDisplay: 'Asset Valuations Monitor (Stability Lens)',
    icon: TrendingDown,
    fredId: 'SP500',
  },
  {
    id: 'nasdaq-stability',
    name: 'NASDAQ Composite (Valuation)',
    description: 'Tech-heavy equity index, monitored for volatility and valuation concerns.',
    categoryKey: 'assetValues',
    categoryDisplay: 'Asset Valuations Monitor (Stability Lens)',
    icon: TrendingUp,
    fredId: 'NASDAQCOM',
  },
  {
    id: 'case-shiller-hpi',
    name: 'S&P/Case-Shiller Home Price Index',
    description: 'Tracks U.S. residential real estate prices, an indicator of housing market stability.',
    categoryKey: 'assetValues',
    categoryDisplay: 'Asset Valuations Monitor (Stability Lens)',
    icon: Home,
    fredId: 'CSUSHPINSA',
  },
  {
    id: 'fhfa-hpi',
    name: 'FHFA House Price Index',
    description: 'Measures average price changes in repeat sales or refinancing on the same properties.',
    categoryKey: 'assetValues',
    categoryDisplay: 'Asset Valuations Monitor (Stability Lens)',
    icon: LandPlot,
    fredId: 'USSTHPI',
  },
  {
    id: 'reit-index-stability',
    name: 'Wilshire US REIT Index',
    description: 'Tracks performance of U.S. publicly traded Real Estate Investment Trusts (REITs), a proxy for commercial real estate trends.',
    categoryKey: 'assetValues',
    categoryDisplay: 'Asset Valuations Monitor (Stability Lens)',
    icon: Building,
    fredId: 'WILLREITIND',
  },
  // Category: Liquidity Monitor
  {
    id: 'sofr',
    name: 'Secured Overnight Financing Rate (SOFR)',
    description: 'A broad measure of the cost of borrowing cash overnight collateralized by Treasury securities.',
    categoryKey: 'liquidity',
    categoryDisplay: 'Liquidity Monitor',
    icon: Droplets,
    fredId: 'SOFR',
  },
  {
    id: 'cp-tbill-spread',
    name: '3M AA Fin. Commercial Paper - 3M T-Bill Spread',
    description: 'Difference between 3-Month AA Financial Commercial Paper and 3-Month Treasury Bill rates. Indicates short-term credit risk and liquidity.',
    categoryKey: 'liquidity',
    categoryDisplay: 'Liquidity Monitor',
    icon: Filter,
    fredId: 'CPF3MTB3M',
  },
  {
    id: 'm2-money-stock',
    name: 'M2 Money Stock',
    description: 'A broad measure of money supply including cash, checking deposits, savings deposits, money market securities, etc.',
    categoryKey: 'liquidity',
    categoryDisplay: 'Liquidity Monitor',
    icon: MoneyIcon,
    fredId: 'M2SL',
  },
  {
    id: 'sloos-ci-loans',
    name: 'Bank Lending Standards (C&I Loans)',
    description: 'Net percentage of domestic banks tightening standards for commercial and industrial loans to large and middle-market firms.',
    categoryKey: 'liquidity',
    categoryDisplay: 'Liquidity Monitor',
    icon: FileText,
    fredId: 'DRTSCILM',
  },
];

const FinancialStabilityPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary mb-1">Financial Stability Dashboard</h1>
        <p className="text-muted-foreground">
          Monitoring key indicators and metrics to assess potential risks and vulnerabilities in the financial system.
        </p>
      </div>

      {STABILITY_CATEGORIES.map((category) => (
        <section key={category.key} className="pt-2">
          <h2 className="text-2xl font-semibold tracking-tight mb-4 pb-2 border-b border-border text-foreground">
            {category.emoji && <span className="mr-2">{category.emoji}</span>}
            {category.display}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {STABILITY_INDICATORS.filter(ind => ind.categoryKey === category.key).map((indicator) => {
              const IconComponent = indicator.icon || BarChartHorizontalBig;
              const isPlaceholder = !indicator.fredId;

              if (isPlaceholder) {
                return (
                  <div
                    key={indicator.id}
                    className="block p-6 bg-card/50 text-card-foreground/50 rounded-lg shadow border border-dashed border-border"
                  >
                    <div className="flex items-center mb-2">
                      <IconComponent className="h-6 w-6 mr-3 text-muted-foreground" />
                      <h3 className="text-lg font-semibold text-muted-foreground">{indicator.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{indicator.description}</p>
                    <div className="mt-3 text-xs text-muted-foreground">
                      (Coming Soon)
                    </div>
                  </div>
                );
              }
              
              // Render actual links for indicators with fredId
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
            })}
          </div>
           {STABILITY_INDICATORS.filter(ind => ind.categoryKey === category.key && !ind.fredId).length === STABILITY_INDICATORS.filter(ind => ind.categoryKey === category.key).length && 
            STABILITY_INDICATORS.filter(ind => ind.categoryKey === category.key).length > 0 && (
             <p className="text-sm text-muted-foreground mt-4">Indicators for this section will be added soon.</p>
           )}
           {STABILITY_INDICATORS.filter(ind => ind.categoryKey === category.key).length === 0 && (
             <p className="text-sm text-muted-foreground mt-4">This category is under development.</p>
           )}
        </section>
      ))}
    </div>
  );
};

export default FinancialStabilityPage;
