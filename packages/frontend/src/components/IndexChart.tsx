import React from 'react';
import Plot from 'react-plotly.js';

export interface IndexChartProps {
  data: { date: string; value: number }[];
  indexName: string;
}

const IndexChart: React.FC<IndexChartProps> = ({ data, indexName }) => {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">No data available.</div>;
  }
  return (
    <Plot
      data={[
        {
          x: data.map(d => d.date),
          y: data.map(d => d.value),
          type: 'scatter',
          mode: 'lines',
          line: {
            color: '#1a3a6b',
            width: 4,
            shape: 'spline',
            simplify: true,
            dash: 'solid',
          },
          fill: 'tozeroy',
          fillcolor: 'rgba(26,58,107,0.08)',
          name: indexName,
          hoverinfo: 'x+y',
          hoverlabel: {
            bgcolor: '#fff',
            bordercolor: '#1a3a6b',
            font: { family: 'Inter, Helvetica Neue, Arial, sans-serif', size: 15, color: '#1a3a6b' },
          },
          marker: {
            color: '#1a3a6b',
            size: 9,
            opacity: 0.2,
            line: { width: 0 },
          },
          selected: {
            marker: { opacity: 1, size: 13, color: '#1a3a6b' },
          },
          unselected: {
            marker: { opacity: 0.2 },
          },
        },
      ]}
      layout={{
        title: {
          text: `${indexName} Historical Performance`,
          font: { size: 16, family: 'Inter, Helvetica Neue, Arial, sans-serif', color: '#1a3a6b', weight: 400 },
          x: 0.01,
          y: 0.94,
          pad: { t: 0, b: 0, l: 0, r: 0 },
        },
        xaxis: {
          tickfont: { size: 13, color: '#1a3a6b' },
          showgrid: false,
          showline: false,
          ticks: 'outside',
          ticklen: 4,
          tickcolor: '#e5e7eb',
          nticks: 8,
          automargin: true,

        },
        yaxis: {
          tickfont: { size: 13, color: '#1a3a6b' },
          showgrid: true,
          gridcolor: 'rgba(26,58,107,0.08)',
          zeroline: false,
          showline: false,
          ticks: 'outside',
          ticklen: 4,
          tickcolor: '#e5e7eb',
          nticks: 7,
          automargin: true,
        },
        autosize: true,
        margin: { l: 24, r: 8, t: 32, b: 32 },
        legend: { orientation: 'h', y: -0.18, x: 0.01, font: { size: 13, color: '#1a3a6b' }, bgcolor: 'rgba(0,0,0,0)' },
        plot_bgcolor: '#fff',
        paper_bgcolor: '#fff',
        hovermode: 'x unified',
        responsive: true,
        dragmode: 'pan',
        transition: { duration: 400, easing: 'cubic-in-out' },
      }}
      config={{
        responsive: true,
        displayModeBar: false,
        displaylogo: false,
        scrollZoom: true,
        toImageButtonOptions: {
          format: 'png',
          filename: `${indexName}-chart`,
          height: 440,
          width: 1200,
          scale: 2,
        },
      }}
      style={{ width: '100%', height: '100%', minHeight: 400, maxHeight: 500 }}
      useResizeHandler
    />
  );
};

export default IndexChart;
