import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface MacroData {
  FEDFUNDS?: { value: number; date: string };
  CPIAUCSL?: { value: number; date: string };
  UNRATE?: { value: number; date: string };
}

const TableContainer: React.FC = () => {
  const [macro, setMacro] = useState<MacroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    axios.get('/api/macro')
      .then((res) => {
        // Support both {data: {...}, error} and direct object
        const macroData = res.data.data || res.data;
        const macroError = res.data.error;
        setMacro(macroData);
        setError(macroError || null);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load data');
      })
      .finally(() => setLoading(false));
  }, []);

  // Debug log
  console.log('macro', macro);

  if (loading) {
    return <div className="bg-card text-card-foreground rounded-lg shadow p-4">Loading macro data...</div>;
  }
  if (error) {
    return <div className="bg-card text-card-foreground rounded-lg shadow p-4 text-red-600">Error loading data: {error}</div>;
  }

  // Show warning if all macro values are missing
  const allMacroMissing = !macro?.FEDFUNDS?.value && !macro?.CPIAUCSL?.value && !macro?.UNRATE?.value;

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-2">Data Table</h2>
      {allMacroMissing && (
        <div className="text-warning mb-2">Warning: No macroeconomic data available for the latest date.</div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-muted-foreground">
          <thead className="text-xs uppercase bg-muted text-muted-foreground">
            <tr>
              <th scope="col" className="px-6 py-3">Metric</th>
              <th scope="col" className="px-6 py-3">Value</th>
              <th scope="col" className="px-6 py-3">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-card border-b border-border">
              <th scope="row" className="px-6 py-4 font-medium text-foreground whitespace-nowrap">Fed Funds Rate</th>
              <td className="px-6 py-4">{macro?.FEDFUNDS?.value != null ? macro.FEDFUNDS.value.toFixed(2) + '%' : 'N/A'}</td>
              <td className="px-6 py-4">{macro?.FEDFUNDS?.date || 'N/A'}</td>
            </tr>
            <tr className="bg-card border-b border-border">
              <th scope="row" className="px-6 py-4 font-medium text-foreground whitespace-nowrap">CPI</th>
              <td className="px-6 py-4">{macro?.CPIAUCSL?.value != null ? macro.CPIAUCSL.value.toFixed(2) : 'N/A'}</td>
              <td className="px-6 py-4">{macro?.CPIAUCSL?.date || 'N/A'}</td>
            </tr>
            <tr className="bg-card border-b border-border">
              <th scope="row" className="px-6 py-4 font-medium text-foreground whitespace-nowrap">Unemployment Rate</th>
              <td className="px-6 py-4">{macro?.UNRATE?.value != null ? macro.UNRATE.value.toFixed(2) + '%' : 'N/A'}</td>
              <td className="px-6 py-4">{macro?.UNRATE?.date || 'N/A'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableContainer;