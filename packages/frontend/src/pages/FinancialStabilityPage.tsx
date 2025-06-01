import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Landmark, Home, BarChartHorizontalBig, BarChart3 } from 'lucide-react';

interface StabilityIndicatorInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  icon?: React.ElementType;
  fredId?: string;
}

const STABILITY_INDICATORS: StabilityIndicatorInfo[] = [
  // Category: Interest Rates Monitor
  {
    id: 'fedfunds',
    name: 'Federal Funds Effective Rate',
    description: 'The target rate set by the FOMC for interbank lending of reserves.',
    category: 'Interest Rates Monitor',
    icon: Landmark,
    fredId: 'FEDFUNDS',
  },
  {
    id: '10y-treasury',
    name: '10-Year Treasury Yield',
    description: 'Yield on the 10-year U.S. Treasury note, a benchmark for long-term interest rates.',
    category: 'Interest Rates Monitor',
    icon: TrendingUp,
    fredId: 'DGS10',
  },
  {
    id: 'corp-bond-yield',
    name: 'US Corporate Bond Effective Yield',
    description: 'ICE BofA US Corporate Index Effective Yield, representing investment-grade corporate debt.',
    category: 'Interest Rates Monitor',
    icon: BarChartHorizontalBig,
    fredId: 'BAMLC0A0CM',
  },
  {
    id: 'mortgage-30y',
    name: '30-Year Fixed Mortgage Rate',
    description: 'Average rate for a 30-year fixed-rate mortgage in the U.S.',
    category: 'Interest Rates Monitor',
    icon: Home,
    fredId: 'MORTGAGE30US',
  },
  // --- Placeholders for other categories ---
  {
    id: 'placeholder-default-rates',
    name: 'Default Rates Overview',
    description: 'Key metrics on consumer, mortgage, and corporate defaults.',
    category: 'Increasing Default Rates',
    fredId: '',
  },
  {
    id: 'placeholder-debt-ratios',
    name: 'Debt-to-Income Ratios Overview',
    description: 'Household, corporate, and government debt levels relative to income/GDP.',
    category: 'High Debt-to-Income Ratios',
    fredId: '',
  },
  {
    id: 'placeholder-asset-values',
    name: 'Asset Value Trends (Stability)',
    description: 'Monitoring stock market, housing, and commercial real estate for sharp declines.',
    category: 'Declining Asset Values',
    fredId: '',
  },
  {
    id: 'placeholder-liquidity',
    name: 'Market Liquidity Monitor',
    description: 'Indicators of stress in short-term funding markets and banking system liquidity.',
    category: 'Reduced Liquidity',
    fredId: '',
  },
];

const FinancialStabilityPage: React.FC = () => {
  const categories = [
    'Interest Rates Monitor',
    'Increasing Default Rates',
    'High Debt-to-Income Ratios',
    'Declining Asset Values',
    'Reduced Liquidity',
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary mb-1">Financial Stability Dashboard</h1>
        <p className="text-muted-foreground">
          Monitoring key indicators and metrics to assess potential risks and vulnerabilities in the financial system.
        </p>
      </div>

      {categories.map((categoryName) => (
        <section key={categoryName} className="pt-2">
          <h2 className="text-2xl font-semibold tracking-tight mb-4 pb-2 border-b border-border text-foreground">
            {categoryName === 'Interest Rates Monitor' && '🚨 '}
            {categoryName === 'Increasing Default Rates' && '📉 '}
            {categoryName === 'High Debt-to-Income Ratios' && '⚖️ '}
            {categoryName === 'Declining Asset Values' && '📉 '}
            {categoryName === 'Reduced Liquidity' && '💧 '}
            {categoryName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {STABILITY_INDICATORS.filter(ind => ind.category === categoryName).map((indicator) => {
              const IconComponent = indicator.icon || BarChart3;
              const isPlaceholder = !indicator.fredId;

              if (isPlaceholder && categoryName !== 'Interest Rates Monitor') {
                return (
                  <div
                    key={indicator.id}
                    className="block p-6 bg-card/50 text-card-foreground/50 rounded-lg shadow border border-dashed border-border"
                  >
                    <div className="flex items-center mb-2">
                      <IconComponent className="h-6 w-6 mr-3 text-muted-foreground" />
                      <h3 className="text-lg font-semibold text-muted-foreground">{indicator.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{indicator.description}</p>
                    <div className="mt-3 text-xs text-muted-foreground">
                      (Coming Soon)
                    </div>
                  </div>
                );
              }
              
              if (indicator.fredId) {
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
                    <p className="text-sm text-muted-foreground">{indicator.description}</p>
                    <div className="mt-3 text-xs text-primary hover:underline group-hover:text-primary/80 transition-colors">
                      View Details &rarr;
                    </div>
                  </Link>
                );
              }
              return null;
            })}
          </div>
           {categoryName !== 'Interest Rates Monitor' && STABILITY_INDICATORS.filter(ind => ind.category === categoryName).length === 0 && (
             <p className="text-sm text-muted-foreground">Indicators for this section will be added soon.</p>
           )}
        </section>
      ))}
    </div>
  );
};

export default FinancialStabilityPage;
