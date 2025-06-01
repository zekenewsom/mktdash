import React from 'react';

interface DataPointValue {
  date: string;
  value: number;
}

interface AnalyticalMetrics {
  sma50?: number | null;
  sma200?: number | null;
  yearlyHigh?: DataPointValue | null;
  yearlyLow?: DataPointValue | null;
}

interface IndicatorAnalyticsPanelProps {
  metrics?: AnalyticalMetrics;
}

const MetricItem: React.FC<{ label: string; value?: string | number | null; date?: string | null; unit?: string }> = ({ label, value, date, unit }) => {
  if (value === null || value === undefined) {
    return (
      <div className="py-2">
        <span className="text-sm font-medium text-muted-foreground">{label}: </span>
        <span className="text-sm text-muted-foreground">N/A</span>
      </div>
    );
  }
  return (
    <div className="py-2">
      <span className="text-sm font-medium text-muted-foreground">{label}: </span>
      <span className="text-sm font-semibold text-foreground">
        {typeof value === 'number' ? value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : value}
        {unit}
      </span>
      {date && <span className="text-xs text-muted-foreground ml-1">({new Date(date).toLocaleDateString()})</span>}
    </div>
  );
};

const IndicatorAnalyticsPanel: React.FC<IndicatorAnalyticsPanelProps> = ({ metrics }) => {
  if (!metrics || Object.keys(metrics).length === 0) {
    return (
      <div className="p-4 bg-card text-card-foreground rounded-lg shadow mt-6">
        <p className="text-sm text-muted-foreground">Additional analytics are not available.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-card text-card-foreground rounded-lg shadow mt-6">
      <h2 className="text-xl font-semibold mb-3 text-primary">Analytical Metrics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <MetricItem label="50-Period SMA" value={metrics.sma50} />
        <MetricItem label="200-Period SMA" value={metrics.sma200} />
        <MetricItem label="52-Week High" value={metrics.yearlyHigh?.value} date={metrics.yearlyHigh?.date} />
        <MetricItem label="52-Week Low" value={metrics.yearlyLow?.value} date={metrics.yearlyLow?.date} />
      </div>
    </div>
  );
};

export default IndicatorAnalyticsPanel;
