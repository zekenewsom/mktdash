import React from 'react';

const IndexChart = React.lazy(() => import('../IndexChart'));

// Placeholder component for displaying interactive charts
interface ChartContainerProps {
  data: { date: string; value: number }[];
  loading: boolean;
  error: string | null;
  indexName: string;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  data,
  loading,
  error,
  indexName,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-col items-center justify-center" style={{ maxWidth: '100%', minHeight: 400, maxHeight: 520, overflow: 'hidden' }}>
      <div className="w-full flex flex-col items-start mb-2">
        <h2 className="text-lg font-semibold text-slate-800 tracking-tight mb-1 pl-1">{indexName} Historical Performance</h2>
      </div>
      <div className="w-full flex-grow flex items-center justify-center" style={{ aspectRatio: '16/7', minHeight: 320, maxHeight: 420, overflow: 'hidden' }}>
        {loading ? (
          <span className="text-muted-foreground">Loading chart...</span>
        ) : error ? (
          <span className="text-red-600">{error}</span>
        ) : (
          <React.Suspense fallback={<span className="text-muted-foreground">Loading chart bundle...</span>}>
            <IndexChart
              data={data}
              indexName={indexName}
            />
          </React.Suspense>
        )}
      </div>
    </div>
  );
};

export default ChartContainer;