import React, { useMemo, useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

interface GaugeChartProps {
  value: number; // 0-100
  name: string;
  rawValueDisplay?: string; // e.g., "2.5%" or "2/3 Up"
  unit?: string; // Unit for the rawValueDisplay or context for the gauge
  min?: number;
  max?: number;
  height?: string | number;
}

interface GaugeThemeColors {
  primary: string;
  foreground: string;
  mutedForeground: string;
  gaugeAxisLineColor?: [number, string][]; // For segments
  gaugePointerColor?: string;
  gaugeDetailColor?: string;
  gaugeTitleColor?: string;
}

const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  name,
  rawValueDisplay,
  unit,
  min = 0,
  max = 100,
  height = 230,
}) => {
  const [themeColors, setThemeColors] = useState<GaugeThemeColors | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const rootStyle = getComputedStyle(document.documentElement);
      const getColor = (varName: string, fallback: string = '#000') => {
        const val = rootStyle.getPropertyValue(varName).trim();
        return val ? `hsl(${val.split(' ').join(', ')})` : fallback;
      };
      
      // Define color segments for the gauge axis based on value
      // Green for 0-40, Yellow for 40-70, Red for 70-100 (assuming higher value is worse for risk, better for sentiment/growth)
      // This can be made more dynamic or passed as props later
      let colorSegments: [number, string][] = [
        [0.4, getColor('--chart-2', '#91cc75')], // Green
        [0.7, getColor('--chart-4', '#fac858')], // Yellow
        [1.0, getColor('--chart-1', '#ee6666')], // Red
      ];
      // If 'Sentiment' or 'Strength', green might be at the higher end.
      if (name.toLowerCase().includes('sentiment') || name.toLowerCase().includes('strength')) {
         colorSegments = [ // Good: Green, Mid: Yellow, Bad: Red
            [0.3, getColor('--chart-1', '#ee6666')], // Red for low values
            [0.7, getColor('--chart-4', '#fac858')], // Yellow for mid
            [1.0, getColor('--chart-2', '#91cc75')],   // Green for high
        ];
      }

      setThemeColors({
        primary: getColor('--primary', 'blue'),
        foreground: getColor('--foreground', '#333'),
        mutedForeground: getColor('--muted-foreground', 'grey'),
        gaugeAxisLineColor: colorSegments,
        gaugePointerColor: getColor('--primary'),
        gaugeDetailColor: getColor('--foreground'),
        gaugeTitleColor: getColor('--muted-foreground'),
      });
    }
  }, [name]); // Re-evaluate colors if name changes (for sentiment/strength vs risk logic)

  const option = useMemo(() => {
    if (!themeColors) return {};

    return {
      series: [
        {
          type: 'gauge',
          min,
          max,
          radius: '90%', // Make gauge larger within its container
          center: ['50%', '52%'], // Move gauge up to fit text below
          progress: {
            show: true,
            width: 12,
            itemStyle: {
              color: themeColors.primary, // Or derive color based on value
            }
          },
          axisLine: {
            lineStyle: {
              width: 12,
              color: themeColors.gaugeAxisLineColor,
            },
          },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: {
            show: true,
            distance: 15,
            fontSize: 10,
            color: themeColors.mutedForeground,
            formatter: function (value: number) { // Show only min, mid, max labels
                if (value === min || value === max || value === (min + max) / 2) {
                    return String(value);
                }
                return '';
            }
          },
          pointer: {
            show: true,
            length: '60%',
            width: 5,
            itemStyle: { color: themeColors.gaugePointerColor }
          },
          anchor: {
            show: true,
            showAbove: true,
            size: 12,
            itemStyle: {
              borderWidth: 4,
              borderColor: themeColors.gaugePointerColor,
              // color: themeColors.card, // Removed, not defined
            }
          },
          detail: {
            valueAnimation: true,
            formatter: '{value}%', // Normalized value
            fontSize: 20,
            fontWeight: 'bold',
            color: themeColors.gaugeDetailColor,
            offsetCenter: [0, '48%'], // Just below needle center
          },
          title: {
            show: true,
            offsetCenter: [0, '85%'], // Further up so it's not cut off
            fontSize: 13,
            color: themeColors.gaugeTitleColor,
          },
          data: [
            {
              value: parseFloat(value.toFixed(1)), // The normalized 0-100 value
              name: `${name}\n${rawValueDisplay || ''}${unit || ''}`, // Show raw value/unit below name
            },
          ],
        },
      ],
      tooltip: { // Basic tooltip for the gauge itself
          formatter: '{a} <br/>{b} : {c}%'
      }
    };
  }, [value, name, rawValueDisplay, unit, min, max, themeColors]);

  if (!themeColors) {
    return <div style={{ height, width: '100%' }} className="flex items-center justify-center text-muted-foreground">Initializing gauge...</div>;
  }

  return (
    <ReactECharts
      option={option}
      style={{ height, width: '100%' }}
      notMerge={true}
      lazyUpdate={true}
    />
  );
};

export default GaugeChart;
