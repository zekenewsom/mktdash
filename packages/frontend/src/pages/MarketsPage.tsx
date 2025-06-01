import React from 'react';
import { Link } from 'react-router-dom';
import MarketOverviewCard from '../components/placeholders/MarketOverviewCard';
import TableContainer from '../components/placeholders/TableContainer';
import NewsFeed from '../components/placeholders/NewsFeed';
import ReportViewer from '../components/placeholders/ReportViewer';
import { Briefcase, TrendingUp, BarChart3 } from 'lucide-react';

interface EquityIndexInfo {
  id: string;
  name: string;
  description: string;
  icon?: React.ElementType;
}

const UITY_INDICES: EquityIndexInfo[] = [
  {
    id: 'SP500',
    name: 'S&P 500',
    description: 'Tracks 500 of the largest U.S. publicly traded companies.',
    icon: Briefcase,
  },
  {
    id: 'NASDAQCOM',
    name: 'Nasdaq Composite',
    description: 'Tracks most stocks listed on the Nasdaq exchange, tech-heavy.',
    icon: TrendingUp,
  },
  {
    id: 'DJIA',
    name: 'Dow Jones Industrial Average',
    description: 'Tracks 30 large, publicly-owned blue-chip companies.',
    icon: BarChart3,
  },
];

// This page component sets up the basic dashboard layout

const MarketsPage: React.FC = () => {
  // In future phases, state management for widget layout will go here
  // For now, use a simple grid const MarketsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary mb-1">Markets Dashboard</h1>
        <p className="text-muted-foreground">Overview of key market indicators and indices.</p>
      </div>

      {/* Existing MarketOverviewCard - provides a broad snapshot */}
      <MarketOverviewCard />

      {/* New Section for U.S. Equity Indices */}
      <div className="pt-4">
        <h2 className="text-2xl font-semibold tracking-tight mb-4 text-foreground">U.S. Equity Indices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {UITY_INDICES.map((index) => {
            const IconComponent = index.icon || BarChart3;
            return (
              <Link
                to={`/series/${index.id}`}
                key={index.id}
                className="block p-6 bg-card text-card-foreground rounded-lg shadow hover:shadow-md transition-shadow duration-200 ease-in-out group"
              >
                <div className="flex items-center mb-2">
                  <IconComponent className="h-6 w-6 mr-3 text-primary group-hover:text-primary/80 transition-colors" />
                  <h3 className="text-lg font-semibold text-primary group-hover:text-primary/80 transition-colors">{index.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{index.description}</p>
                <div className="mt-3 text-xs text-primary hover:underline group-hover:text-primary/80 transition-colors">
                  View Details &rarr;
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Existing TableContainer - provides a quick data view */}
      <div className="pt-4">
        <TableContainer />
      </div>
      
      {/* Other sections like NewsFeed and ReportViewer can remain or be re-organized */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
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