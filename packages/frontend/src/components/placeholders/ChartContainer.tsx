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
    <section className="bg-white rounded-2xl shadow-lg p-3 md:p-6 mb-6 flex flex-col items-center justify-center w-full overflow-hidden min-h-[280px] md:min-h-[400px] max-h-[560px]" aria-label={`${indexName} chart`}>
      <div className="w-full flex flex-col items-start mb-2">
        <h2 className="text-base md:text-lg font-semibold text-slate-800 tracking-tight mb-1 pl-1">{indexName} Historical Performance</h2>
      </div>
      <div className="w-full flex-grow flex items-center justify-center min-h-[220px] md:min-h-[320px] max-h-[440px]" style={{ aspectRatio: '16/8' }}>
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
    </section>
  );
};

export default ChartContainer;