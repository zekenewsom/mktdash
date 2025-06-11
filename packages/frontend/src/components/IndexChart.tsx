import React, { useMemo, useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { graphic } from 'echarts/core'; // For gradient fills

export interface NewIndexChartProps {
  data: { date: string; value: number }[];
  indexName: string;
  loading?: boolean;
  error?: string | null;
}

interface ChartThemeColors {
  primary: string;
  primaryRgb: { h: number; s: number; l: number };
  foreground: string;
  mutedForeground: string;
  border: string;
  card: string;
  primaryGradientStart: string;
  primaryGradientEnd: string;
}

const NewIndexChart: React.FC<NewIndexChartProps> = ({ data, indexName, loading, error }) => {
  const [chartColors, setChartColors] = useState<ChartThemeColors | null>(null);

  useEffect(() => {
    // Ensure this runs only in the browser
    if (typeof window !== 'undefined') {
      const rootStyle = getComputedStyle(document.documentElement);

      const parseHslValue = (variableName: string) => {
        const value = rootStyle.getPropertyValue(variableName).trim(); // e.g., "222.2 47.4% 11.2%"
        if (!value) return { h: 0, s: 0, l: 0, string: '#000000', rgbaString: (alpha: number) => `rgba(0,0,0,${alpha})` };
        
        const parts = value.split(' ');
        const h = parseFloat(parts[0]);
        const s = parseFloat(parts[1].replace('%',''));
        const l = parseFloat(parts[2].replace('%',''));
        
        return {
          h, s, l,
          string: `hsl(${h}, ${s}%, ${l}%)`,
          rgbaString: (alpha: number) => `hsla(${h}, ${s}%, ${l}%, ${alpha})`
        };
      };

      const primaryParsed = parseHslValue('--primary'); //
      const foregroundParsed = parseHslValue('--foreground'); //
      const mutedForegroundParsed = parseHslValue('--muted-foreground'); //
      const borderParsed = parseHslValue('--border'); //
      const cardParsed = parseHslValue('--card'); //

      setChartColors({
        primary: primaryParsed.string,
        primaryRgb: { h: primaryParsed.h, s: primaryParsed.s, l: primaryParsed.l },
        foreground: foregroundParsed.string,
        mutedForeground: mutedForegroundParsed.string,
        border: borderParsed.string,
        card: cardParsed.string,
        primaryGradientStart: primaryParsed.rgbaString(0.15),
        primaryGradientEnd: primaryParsed.rgbaString(0.01),
      });
    }
  }, []); // Re-run if theme changes, for now, runs once on mount. Add theme dependency if you have a theme switcher.

  const option = useMemo(() => {
    if (!chartColors || !data || data.length === 0) {
      // Return a minimal config or null if handled by loading/error states below
      return {
         title: { text: `${indexName} Historical Performance`, textStyle: { color: chartColors?.foreground || '#333' } },
         grid: { containLabel: true },
      };
    }

    const dates = data.map(d => d.date);
    const values = data.map(d => d.value);

    return {
      title: {
        text: `${indexName} Historical Performance`,
        left: 'left',
        textStyle: {
          fontSize: 16,
          fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif',
          color: chartColors.foreground, // Use resolved color
          fontWeight: 400,
        },
        padding: [0,0,0,10]
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: { backgroundColor: '#6a7985' }
        },
        backgroundColor: chartColors.card, // Use resolved color
        borderColor: chartColors.primary, // Use resolved color
        textStyle: {
          fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif',
          fontSize: 14,
          color: chartColors.primary // Use resolved color
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        top: '60px', // Increased slightly for title
        bottom: '12%', // Increased slightly for dataZoom + legend
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dates,
        axisLabel: {
          fontSize: 12,
          color: chartColors.mutedForeground, // Use resolved color
        },
        axisLine: { show: false },
        axisTick: {
          show: true,
          alignWithLabel: true,
          lineStyle: { color: chartColors.border } // Use resolved color
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 12,
          color: chartColors.mutedForeground, // Use resolved color
        },
        splitLine: {
          show: true,
          lineStyle: { color: [chartColors.primaryGradientStart] } // Use resolved color (gradient start for faint grid)
        },
        axisLine: { show: false },
      },
      series: [
        {
          name: indexName,
          type: 'line',
          smooth: true,
          showSymbol: false, // Hide symbols by default, show on hover via emphasis
          symbol: 'circle',
          symbolSize: 8, // Symbol size for hover
          sampling: 'lttb',
          data: values,
          lineStyle: {
            width: 3,
            color: chartColors.primary, // Use resolved color
          },
          areaStyle: {
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: chartColors.primaryGradientStart }, // Use resolved color
              { offset: 1, color: chartColors.primaryGradientEnd }  // Use resolved color
            ])
          },
          emphasis: {
            focus: 'series',
            lineStyle: { width: 3.5 },
            itemStyle: { // This will show symbols on hover
              opacity: 1,
              color: chartColors.primary,
              borderColor: chartColors.card, // Make symbol border match card bg for a 'halo' effect
              borderWidth: 2,
            }
          },
        }
      ],
      legend: {
        data: [indexName],
        bottom: 5, // Adjusted
        left: 'center',
        textStyle: {
          fontSize: 13,
          color: chartColors.mutedForeground, // Use resolved color
        },
        backgroundColor: 'transparent'
      },
      dataZoom: [
        { type: 'inside', start: 0, end: 100 },
        {
          start: 0, end: 100,
          handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '80%',
          handleStyle: { color: '#fff', shadowBlur: 3, shadowColor: 'rgba(0, 0, 0, 0.6)', shadowOffsetX: 2, shadowOffsetY: 2 },
          bottom: '5%', // Adjusted
          height: 20,
          dataBackground: { // Style the data preview in the zoom slider
            lineStyle: { color: chartColors.mutedForeground, opacity: 0.3 },
            areaStyle: { color: chartColors.mutedForeground, opacity: 0.1 }
          },
          selectedDataBackground: { // Style the selected range preview
             lineStyle: { color: chartColors.primary, opacity: 0.7 },
             areaStyle: { color: chartColors.primary, opacity: 0.3 }
          },
          fillerColor: `hsla(${chartColors.primaryRgb.h}, ${chartColors.primaryRgb.s}%, ${chartColors.primaryRgb.l}%, 0.2)` // scrollbar fill
        }
      ],
      toolbox: {
        feature: {
          saveAsImage: { name: `${indexName}-chart`, title: 'Save as Image' },
          dataZoom: { title: { zoom: 'Zoom', back: 'Restore Zoom'} }
        },
        right: 20,
        iconStyle: { borderColor: chartColors.mutedForeground }
      },
      animationDuration: 400,
      animationEasing: 'cubicInOut'
    };
  }, [data, indexName, chartColors]); // Rerun if chartColors change

  // Handle loading and error states before trying to render the chart with incomplete options
  if (loading) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">Loading chart...</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center h-full text-red-600">{error}</div>;
  }
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">No data available.</div>;
  }
  if (!chartColors) {
     // Still fetching colors, or an issue occurred
    return <div className="flex items-center justify-center h-full text-muted-foreground">Initializing chart style...</div>;
  }

  return (
    <ReactECharts
      option={option}
      style={{ height: '100%', width: '100%', minHeight: 400, maxHeight: 500 }}
      notMerge={true}
      lazyUpdate={true}
      // Consider dynamically setting ECharts theme if you have one registered for dark/light
      // theme={appTheme === 'dark' ? 'dark_custom_theme' : 'light_custom_theme'}
    />
  );
};

export default NewIndexChart;