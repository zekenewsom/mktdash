import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingDown, Factory, Briefcase, LineChart, DollarSign, Users } from 'lucide-react';

interface EconomicIndicatorInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  icon?: React.ElementType;
  fredId: string;
}

const ECONOMIC_INDICATORS: EconomicIndicatorInfo[] = [
  // Category: Inflation Monitor
  {
    id: 'cpi',
    name: 'Consumer Price Index (CPI)',
    description: 'Measures average change over time in prices paid by urban consumers for a market basket of consumer goods and services.',
    category: 'Inflation Monitor',
    icon: TrendingDown,
    fredId: 'CPIAUCSL',
  },
  {
    id: 'ppi',
    name: 'Producer Price Index (PPI)',
    description: 'Measures the average change over time in selling prices received by domestic producers for their output.',
    category: 'Inflation Monitor',
    icon: Factory,
    fredId: 'PPIACO',
  },
  {
    id: 'core-pce',
    name: 'Core PCE Price Index',
    description: 'Measures prices paid for goods and services purchased by U.S. consumers, excluding food and energy.',
    category: 'Inflation Monitor',
    icon: DollarSign,
    fredId: 'PCEPILFE',
  },
  // Category: Employment Situation
  {
    id: 'unrate',
    name: 'Unemployment Rate',
    description: 'The percentage of the total labor force that is unemployed but actively seeking employment and willing to work.',
    category: 'Employment Situation',
    icon: Users,
    fredId: 'UNRATE',
  },
  {
    id: 'nfp',
    name: 'Non-Farm Payrolls (NFP)',
    description: 'Measures the number of workers in the U.S. excluding farm workers, private household employees, and non-profit organization employees.',
    category: 'Employment Situation',
    icon: Briefcase,
    fredId: 'PAYEMS',
  },
  {
    id: 'initial-claims',
    name: 'Initial Jobless Claims',
    description: 'The number of individuals who filed for unemployment insurance for the first time during the past week.',
    category: 'Employment Situation',
    icon: LineChart,
    fredId: 'ICSA',
  },
  // --- Placeholders for other categories ---
  {
    id: 'placeholder-gdp',
    name: 'GDP & Growth',
    description: 'Gross Domestic Product and other growth indicators.',
    category: 'Economic Growth',
    fredId: '',
  },
  {
    id: 'placeholder-sentiment',
    name: 'Consumer & Business Sentiment',
    description: 'Surveys measuring confidence and outlook.',
    category: 'Sentiment Indicators',
    fredId: '',
  },
];

const EconomicPage: React.FC = () => {
  const categories = [
    'Inflation Monitor',
    'Employment Situation',
    'Economic Growth',
    'Sentiment Indicators',
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary mb-1">Economic Indicators</h1>
        <p className="text-muted-foreground">
          Tracking key macroeconomic data to understand the health and direction of the economy.
        </p>
      </div>

      {categories.map((categoryName) => (
        <section key={categoryName} className="pt-2">
          <h2 className="text-2xl font-semibold tracking-tight mb-4 pb-2 border-b border-border text-foreground">
            {categoryName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ECONOMIC_INDICATORS.filter(ind => ind.category === categoryName).map((indicator) => {
              const IconComponent = indicator.icon || LineChart;
              const isPlaceholder = !indicator.fredId;

              if (isPlaceholder && (categoryName !== 'Inflation Monitor' && categoryName !== 'Employment Situation')) {
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
                    <p className="text-sm text-muted-foreground leading-relaxed">{indicator.description}</p>
                    <div className="mt-3 text-xs text-primary hover:underline group-hover:text-primary/80 transition-colors">
                      View Details &rarr;
                    </div>
                  </Link>
                );
              }
              return null;
            })}
          </div>
          {(categoryName !== 'Inflation Monitor' && categoryName !== 'Employment Situation') && ECONOMIC_INDICATORS.filter(ind => ind.category === categoryName).length === 0 && (
             <p className="text-sm text-muted-foreground">Indicators for this section will be added soon.</p>
           )}
        </section>
      ))}
    </div>
  );
};

export default EconomicPage;
