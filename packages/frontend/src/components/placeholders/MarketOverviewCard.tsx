import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface MacroData {
  FEDFUNDS?: { value: number; date: string };
  CPIAUCSL?: { value: number; date: string };
  UNRATE?: { value: number; date: string };
}
interface IndexData {
  SP500?: { value: number; change?: number; percentChange?: number };
  NASDAQCOM?: { value: number; change?: number; percentChange?: number };
  DJIA?: { value: number; change?: number; percentChange?: number };
}

interface MarketOverviewCardProps {
  onSelectIndex?: (index: string) => void;
  selectedIndex?: string;
}

const MarketOverviewCard: React.FC<MarketOverviewCardProps> = ({ onSelectIndex, selectedIndex }) => {
  const [macro, setMacro] = useState<MacroData | null>(null);
  const [indices, setIndices] = useState<IndexData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get('/api/macro'),
      axios.get('/api/market-indices'),
    ])
      .then(([macroRes, indicesRes]) => {
        // Support both {data: {...}, error} and direct object
        const macroData = macroRes.data.data || macroRes.data;
        const macroError = macroRes.data.error;
        const indicesData = indicesRes.data.data || indicesRes.data;
        const indicesError = indicesRes.data.error;
        setMacro(macroData);
        setIndices(indicesData);
        setError(macroError || indicesError || null);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load data');
      })
      .finally(() => setLoading(false));
  }, []);

  // Debug log
  console.log('macro', macro);
  console.log('indices', indices);

  if (loading) {
    return <div className="bg-card text-card-foreground rounded-lg shadow p-4">Loading market data...</div>;
  }
  if (error) {
    return <div className="bg-card text-card-foreground rounded-lg shadow p-4 text-red-600">Error loading data: {error}</div>;
  }

  // Show warning if all macro values are missing
  const allMacroMissing = !macro?.FEDFUNDS?.value && !macro?.CPIAUCSL?.value && !macro?.UNRATE?.value;

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-2">Market Overview</h2>
      {allMacroMissing && (
        <div className="text-warning mb-2">Warning: No macroeconomic data available for the latest date.</div>
      )}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <div className="flex flex-col">
          <button
            className={`text-muted-foreground text-left focus:outline-none ${selectedIndex === 'SP500' ? 'underline font-semibold' : ''}`}
            onClick={() => onSelectIndex && onSelectIndex('SP500')}
            type="button"
          >
            S&amp;P 500
          </button>
          <span className="font-medium">
            {indices?.SP500?.value != null ? indices.SP500.value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : 'N/A'}
            <span className={indices?.SP500?.change! >= 0 ? 'text-positive ml-1' : 'text-negative ml-1'}>
              ({indices?.SP500?.percentChange != null ? (indices.SP500.change! >= 0 ? '+' : '') + indices.SP500.percentChange.toFixed(2) : 'N/A'}%)
            </span>
          </span>
        </div>
        <div className="flex flex-col">
          <button
            className={`text-muted-foreground text-left focus:outline-none ${selectedIndex === 'NASDAQCOM' ? 'underline font-semibold' : ''}`}
            onClick={() => onSelectIndex && onSelectIndex('NASDAQCOM')}
            type="button"
          >
            Nasdaq
          </button>
          <span className="font-medium">
            {indices?.NASDAQCOM?.value != null ? indices.NASDAQCOM.value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : 'N/A'}
            <span className={indices?.NASDAQCOM?.change! >= 0 ? 'text-positive ml-1' : 'text-negative ml-1'}>
              ({indices?.NASDAQCOM?.percentChange != null ? (indices.NASDAQCOM.change! >= 0 ? '+' : '') + indices.NASDAQCOM.percentChange.toFixed(2) : 'N/A'}%)
            </span>
          </span>
        </div>
        <div className="flex flex-col">
          <button
            className={`text-muted-foreground text-left focus:outline-none ${selectedIndex === 'DJIA' ? 'underline font-semibold' : ''}`}
            onClick={() => onSelectIndex && onSelectIndex('DJIA')}
            type="button"
          >
            Dow Jones
          </button>
          <span className="font-medium">
            {indices?.DJIA?.value != null ? indices.DJIA.value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : 'N/A'}
            <span className={indices?.DJIA?.change! >= 0 ? 'text-positive ml-1' : 'text-negative ml-1'}>
              ({indices?.DJIA?.percentChange != null ? (indices?.DJIA?.change! >= 0 ? '+' : '') + indices.DJIA.percentChange.toFixed(2) : 'N/A'}%)
            </span>
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground">Fed Funds Rate</span>
          <span className="font-medium">
            {macro?.FEDFUNDS?.value != null ? macro.FEDFUNDS.value.toFixed(2) + '%' : 'N/A'}
            <span className="text-muted-foreground ml-1">({macro?.FEDFUNDS?.date || 'N/A'})</span>
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground">CPI</span>
          <span className="font-medium">
            {macro?.CPIAUCSL?.value != null ? macro.CPIAUCSL.value.toFixed(2) : 'N/A'}
            <span className="text-muted-foreground ml-1">({macro?.CPIAUCSL?.date || 'N/A'})</span>
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground">Unemployment Rate</span>
          <span className="font-medium">
            {macro?.UNRATE?.value != null ? macro.UNRATE.value.toFixed(2) + '%' : 'N/A'}
            <span className="text-muted-foreground ml-1">({macro?.UNRATE?.date || 'N/A'})</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default MarketOverviewCard;