import React from 'react';

// Placeholder component for displaying overall market indices and key stats
const MarketOverviewCard: React.FC = () => {
  return (
    <div className="bg-card text-card-foreground rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-2">Market Overview</h2>
      <p className="text-muted-foreground">
        [Placeholder for S&P 500, Nasdaq, Dow Jones, Bonds, Commodities, FX, Crypto key stats]
      </p>
      {/* Add grid or flexbox here to display multiple key stats */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
         <div className="flex flex-col">
            <span className="text-muted-foreground">S&P 500</span>
            <span className="font-medium">5200.50 <span className="text-positive">(+0.5%)</span></span>
         </div>
         <div className="flex flex-col">
            <span className="text-muted-foreground">Nasdaq</span>
            <span className="font-medium">16300.10 <span className="text-negative">(-0.1%)</span></span>
         </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">10Y Yield</span>
            <span className="font-medium">4.50% <span className="text-negative">(-0.02%)</span></span>
         </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">WTI Oil</span>
            <span className="font-medium">$78.90 <span className="text-positive">(+1.2%)</span></span>
         </div>
      </div>
    </div>
  );
};

export default MarketOverviewCard;