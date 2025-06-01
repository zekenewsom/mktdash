import React from 'react';

const EconomicPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Economic Indicators Dashboard</h1>
      <p className="text-muted-foreground">
        This section will display key economic indicators such as inflation, employment, GDP, and sentiment.
        Content to be developed in a future step.
      </p>
      {/* Placeholder for future components specific to economic indicators */}
      <div className="mt-6 p-6 bg-card rounded-lg shadow">
        <h2 className="text-xl font-medium">Coming Soon</h2>
        <p className="mt-2 text-sm text-muted-foreground">Detailed charts and metrics for various economic data points will be available here.</p>
      </div>
    </div>
  );
};

export default EconomicPage;
