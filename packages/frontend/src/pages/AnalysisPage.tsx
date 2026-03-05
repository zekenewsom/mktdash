import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { availableCharts } from '../chartList';

// Dummy data for demonstration
// Replace this with real chart metadata and data fetching logic
// availableCharts = [{ id: 'sp500', name: 'S&P 500', data: [...] }, ...]

const AnalysisPage: React.FC = () => {
  const [selectedCharts, setSelectedCharts] = useState<string[]>([]);

  // Find chart data for selected charts
  const selectedChartData = availableCharts.filter(chart => selectedCharts.includes(chart.id));

  // Build ECharts series config
  const series = selectedChartData.map(chart => ({
    name: chart.name,
    type: 'line',
    data: chart.data.map(d => [d.date, d.value]),
    smooth: true,
    showSymbol: false,
  }));

  // Use the x-axis of the first selected chart for demonstration
  const xData = selectedChartData[0]?.data.map(d => d.date) || [];

  const option = {
    tooltip: { trigger: 'axis' },
    legend: { data: selectedChartData.map(c => c.name), top: 5 },
    xAxis: { type: 'category', data: xData },
    yAxis: { type: 'value', scale: true },
    series,
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Analysis</h1>
      <p className="mb-4">Select charts to overlay and compare their performance visually.</p>
      <div className="mb-6">
        <label className="block mb-2 font-medium">Select Charts:</label>
        <select
          multiple
          className="w-full border rounded p-2"
          value={selectedCharts}
          onChange={e => {
            const options = Array.from(e.target.selectedOptions, o => o.value);
            setSelectedCharts(options);
          }}
        >
          {availableCharts.map(chart => (
            <option key={chart.id} value={chart.id}>{chart.name}</option>
          ))}
        </select>
      </div>
      <div style={{ minHeight: 400 }}>
        {selectedCharts.length === 0 ? (
          <div className="text-muted-foreground">Select one or more charts to compare.</div>
        ) : (
          <ReactECharts option={option} style={{ height: 400, width: '100%' }} />
        )}
      </div>
    </div>
  );
};

export default AnalysisPage;
