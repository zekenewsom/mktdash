import React from 'react';

interface SeriesInfo {
  id?: string;
  title?: string;
  units_short?: string;
  seasonal_adjustment_short?: string;
  frequency_short?: string;
  last_updated?: string;
}

interface CurrentValue {
  date: string;
  value: number;
}

interface IndicatorHeaderProps {
  seriesInfo?: SeriesInfo;
  currentValue?: CurrentValue;
  seriesId: string; // For fallback display
}

const IndicatorHeader: React.FC<IndicatorHeaderProps> = ({ seriesInfo, currentValue, seriesId }) => {
  const title = seriesInfo?.title || seriesId;
  const lastVal = currentValue?.value?.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const lastDate = currentValue?.date;
  const units = seriesInfo?.units_short || '';

  return (
    <div className="mb-6 p-4 bg-card text-card-foreground rounded-lg shadow">
      <h1 className="text-2xl font-semibold text-primary mb-1">{title}</h1>
      {currentValue && (
        <div className="text-xl font-medium text-foreground mb-1">
          {lastVal} <span className="text-sm text-muted-foreground">{units}</span>
        </div>
      )}
      {lastDate && (
        <p className="text-sm text-muted-foreground">
          Last Updated: {new Date(lastDate).toLocaleDateString()}
        </p>
      )}
      {seriesInfo?.last_updated && (
         <p className="text-xs text-muted-foreground mt-1">
            Source Last Updated: {new Date(seriesInfo.last_updated).toLocaleString()}
        </p>
      )}
       {seriesInfo?.frequency_short && (
         <p className="text-xs text-muted-foreground">
            Frequency: {seriesInfo.frequency_short}
        </p>
      )}
      {seriesInfo?.seasonal_adjustment_short && (
         <p className="text-xs text-muted-foreground">
            Adjustment: {seriesInfo.seasonal_adjustment_short}
        </p>
      )}
    </div>
  );
};

export default IndicatorHeader;
