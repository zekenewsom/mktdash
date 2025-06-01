import React from 'react';
import { cn } from "../../lib/utils";

interface MetricDetail {
  absoluteChange: number | null;
  percentChange: number | null;
  pastDate: string | null;
  pastValue: number | null;
}

interface Metrics {
  '1D'?: MetricDetail;
  '1W'?: MetricDetail;
  '1M'?: MetricDetail;
  '3M'?: MetricDetail;
  '6M'?: MetricDetail;
  '1Y'?: MetricDetail;
  'YTD'?: MetricDetail;
  [key: string]: MetricDetail | undefined;
}

interface IndicatorMetricsTableProps {
  metrics?: Metrics;
}

const IndicatorMetricsTable: React.FC<IndicatorMetricsTableProps> = ({ metrics }) => {
  if (!metrics || Object.keys(metrics).length === 0) {
    return <div className="p-4 bg-card text-card-foreground rounded-lg shadow text-muted-foreground">No performance metrics available.</div>;
  }

  const periodOrder: (keyof Metrics)[] = ['1D', '1W', '1M', '3M', '6M', '1Y', 'YTD'];

  const renderMetricValue = (value: number | null | undefined, isPercent: boolean = false, addPlus: boolean = false) => {
    if (value === null || value === undefined) return <span className="text-muted-foreground">N/A</span>;
    const displayValue = isPercent ? value.toFixed(2) + '%' : value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    const plusSign = addPlus && value > 0 ? '+' : '';
    return (
      <span className={cn(value > 0 ? 'text-positive' : value < 0 ? 'text-negative' : 'text-foreground')}>
        {plusSign}{displayValue}
      </span>
    );
  };

  return (
    <div className="p-4 bg-card text-card-foreground rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-3 text-primary">Performance Metrics</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground border-b border-border">
              <th className="py-2 px-3 font-medium">Period</th>
              <th className="py-2 px-3 font-medium">Change</th>
              <th className="py-2 px-3 font-medium">% Change</th>
              <th className="py-2 px-3 font-medium">Value at Period Start</th>
            </tr>
          </thead>
          <tbody>
            {periodOrder.map(period => {
              const metric = metrics[period];
              if (!metric) return null;
              return (
                <tr key={period} className="border-b border-border last:border-b-0 hover:bg-accent">
                  <td className="py-2 px-3 font-medium text-foreground">{period}</td>
                  <td className="py-2 px-3">{renderMetricValue(metric.absoluteChange, false, true)}</td>
                  <td className="py-2 px-3">{renderMetricValue(metric.percentChange, true, true)}</td>
                  <td className="py-2 px-3">
                    {metric.pastValue !== null && metric.pastValue !== undefined
                      ? metric.pastValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
                      : <span className="text-muted-foreground">N/A</span>}
                    {metric.pastDate && <span className="ml-2 text-xs text-muted-foreground">({metric.pastDate})</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IndicatorMetricsTable;
