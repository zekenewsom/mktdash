import React, { useMemo, useEffect, useState, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { graphic } from 'echarts/core';
import { Button } from './ui/button';
import { LineChart as LineChartIcon, Trash2, Hand, Ruler } from 'lucide-react';

interface DataPoint {
  date: string;
  value: number;
}

export interface NewIndexChartProps {
  data: DataPoint[];
  indexName: string;
  sma50Data?: DataPoint[];
  sma200Data?: DataPoint[];
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
  sma50Color?: string;
  sma200Color?: string;
  drawingLineColor?: string;
  measurementLineColor?: string;
  measurementFillColor?: string;
}

interface Measurement {
  start: DataPoint;
  end: DataPoint;
  change: number;
  percentChange: number;
}


type InteractionTool = 'none' | 'trendline' | 'measure';
interface DrawnLine {
  id: string;
  type: 'trendline';
  start: DataPoint;
  end: DataPoint;
  color: string;
}

const NewIndexChart: React.FC<NewIndexChartProps> = ({
  data,
  indexName,
  sma50Data,
  sma200Data,
  loading,
  error,
}) => {
  const [chartColors, setChartColors] = useState<ChartThemeColors | null>(null);
  const echartsRef = useRef<any>(null);

  // Drawing State
  const [activeTool, setActiveTool] = useState<InteractionTool>('none');
  const [tempInteractionPoints, setTempInteractionPoints] = useState<DataPoint[]>([]);
  const [drawnLines, setDrawnLines] = useState<DrawnLine[]>([]);
  const [measurement, setMeasurement] = useState<Measurement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const rootStyle = getComputedStyle(document.documentElement);
      const parseHslValue = (variableName: string, fallbackColor = '#000000') => {
        const value = rootStyle.getPropertyValue(variableName).trim();
        if (!value) return { h: 0, s: 0, l: 0, string: fallbackColor, rgbaString: (alpha: number) => `rgba(0,0,0,${alpha})` };
        const parts = value.split(' ');
        const h = parseFloat(parts[0]);
        const s = parseFloat(parts[1].replace('%',''));
        const l = parseFloat(parts[2].replace('%',''));
        return {
          h, s, l,
          string: `hsl(${h}, ${s}%, ${l}%)`,
          rgbaString: (alpha: number) => `hsla(${h}, ${s}%, ${l}%, ${alpha})`,
        };
      };
      const primaryParsed = parseHslValue('--primary', 'blue');
      const foregroundParsed = parseHslValue('--foreground', '#333');
      const mutedForegroundParsed = parseHslValue('--muted-foreground', 'grey');
      const borderParsed = parseHslValue('--border', 'lightgrey');
      const cardParsed = parseHslValue('--card', 'white');
      const sma50Color = rootStyle.getPropertyValue('--chart-2').trim() ? `hsl(${rootStyle.getPropertyValue('--chart-2').trim().split(' ').join(', ')})` : 'orange';
      const sma200Color = rootStyle.getPropertyValue('--chart-3').trim() ? `hsl(${rootStyle.getPropertyValue('--chart-3').trim().split(' ').join(', ')})` : 'purple';
      const drawingLineColor = rootStyle.getPropertyValue('--chart-4').trim() ? `hsl(${rootStyle.getPropertyValue('--chart-4').trim().split(' ').join(', ')})` : '#FF6347';
      const measurementLineColor = rootStyle.getPropertyValue('--chart-5').trim() ? `hsl(${rootStyle.getPropertyValue('--chart-5').trim().split(' ').join(', ')})` : '#4682B4'; // SteelBlue
      const measurementFillColor = `hsla(${primaryParsed.h}, ${primaryParsed.s}%, ${primaryParsed.l}%, 0.1)`;
      setChartColors({
        primary: primaryParsed.string,
        primaryRgb: { h: primaryParsed.h, s: primaryParsed.s, l: primaryParsed.l },
        foreground: foregroundParsed.string,
        mutedForeground: mutedForegroundParsed.string,
        border: borderParsed.string,
        card: cardParsed.string,
        primaryGradientStart: primaryParsed.rgbaString(0.15),
        primaryGradientEnd: primaryParsed.rgbaString(0.01),
        sma50Color: sma50Color,
        sma200Color: sma200Color,
        drawingLineColor: drawingLineColor,
        measurementLineColor,
        measurementFillColor,
      });
    }
  }, []);

  const handleChartClick = (params: any) => {
    if (activeTool === 'none' || !chartColors) return;
    const echartsInstance = echartsRef.current?.getEchartsInstance();
    if (!echartsInstance) return;
    const clickCoords = [params.offsetX, params.offsetY];
    const dataCoord = echartsInstance.convertFromPixel({ gridIndex: 0 }, clickCoords);
    if (!dataCoord) return;
    const xIndex = Math.round(dataCoord[0]);
    const dates = data.map(d => d.date);
    if (xIndex < 0 || xIndex >= dates.length) return;
    const clickedDate = dates[xIndex];
    const clickedValue = dataCoord[1];
    const currentDataPoint: DataPoint = { date: clickedDate, value: parseFloat(clickedValue.toFixed(4)) };

    if (activeTool === 'trendline') {
      const newTempPoints = [...tempInteractionPoints, currentDataPoint];
      if (newTempPoints.length === 1) {
        setTempInteractionPoints(newTempPoints);
      } else if (newTempPoints.length === 2) {
        setDrawnLines((prevLines) => [
          ...prevLines,
          {
            id: `line-${Date.now()}`,
            type: 'trendline',
            start: newTempPoints[0],
            end: newTempPoints[1],
            color: chartColors.drawingLineColor || 'red',
          },
        ]);
        setTempInteractionPoints([]);
      }
    } else if (activeTool === 'measure') {
      const newTempPoints = [...tempInteractionPoints, currentDataPoint];
      if (newTempPoints.length === 1) {
        setTempInteractionPoints(newTempPoints);
        setMeasurement(null);
      } else if (newTempPoints.length === 2) {
        const startPt = newTempPoints[0];
        const endPt = newTempPoints[1];
        const change = endPt.value - startPt.value;
        const percentChange = startPt.value !== 0 ? (change / startPt.value) * 100 : (change > 0 ? Infinity : (change < 0 ? -Infinity : 0) );
        setMeasurement({
          start: startPt,
          end: endPt,
          change: parseFloat(change.toFixed(2)),
          percentChange: parseFloat(percentChange.toFixed(2)),
        });
        setTempInteractionPoints([]);
      }
    }
  };

  const clearInteractions = () => {
    setDrawnLines([]);
    setTempInteractionPoints([]);
    setMeasurement(null);
    setActiveTool('none');
  };

  const option = useMemo(() => {
    if (!chartColors || !data || data.length === 0) {
      return {
        title: { text: `${indexName} Historical Performance`, textStyle: { color: chartColors?.foreground || '#333' } },
        grid: { containLabel: true },
      };
    }
    const dates = data.map(d => d.date);
    let baseOptionSeries: any[] = [
      {
        name: indexName,
        type: 'line',
        smooth: true,
        showSymbol: false,
        sampling: 'lttb',
        data: data.map(d => d.value),
        lineStyle: { width: 2.5, color: chartColors.primary },
        areaStyle: {
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: chartColors.primaryGradientStart },
            { offset: 1, color: chartColors.primaryGradientEnd },
          ]),
        },
        emphasis: {
          focus: 'series',
          lineStyle: { width: 3 },
          itemStyle: { opacity: 1, color: chartColors.primary, borderColor: chartColors.card, borderWidth: 2 },
        },
      },
    ];
    const legendData = [indexName];
    if (sma50Data && sma50Data.length > 0) {
      legendData.push('SMA 50');
      baseOptionSeries.push({
        name: 'SMA 50',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: sma50Data.map(d => [d.date, d.value]),
        lineStyle: { width: 1.5, color: chartColors.sma50Color || 'orange', type: 'dashed' },
        emphasis: { focus: 'series', lineStyle: { width: 2 } },
      });
    }
    if (sma200Data && sma200Data.length > 0) {
      legendData.push('SMA 200');
      baseOptionSeries.push({
        name: 'SMA 200',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: sma200Data.map(d => [d.date, d.value]),
        lineStyle: { width: 1.5, color: chartColors.sma200Color || 'purple', type: 'dotted' },
        emphasis: { focus: 'series', lineStyle: { width: 2 } },
      });
    }

    // Add custom series for drawn trend lines
    if (drawnLines.length > 0) {
      baseOptionSeries.push({
        type: 'custom',
        name: 'User Drawings',
        renderItem: (params: any, api: any) => {
          const currentLine = drawnLines[params.dataIndex];
          if (!currentLine) return;
          const startXIndex = dates.indexOf(currentLine.start.date);
          const endXIndex = dates.indexOf(currentLine.end.date);
          if (startXIndex === -1 || endXIndex === -1) return;
          const startPx = api.coord([startXIndex, currentLine.start.value]);
          const endPx = api.coord([endXIndex, currentLine.end.value]);
          if (!startPx || !endPx) return;
          return {
            type: 'line',
            shape: { x1: startPx[0], y1: startPx[1], x2: endPx[0], y2: endPx[1] },
            style: { stroke: currentLine.color, lineWidth: 2 },
            z: 100,
          };
        },
        data: drawnLines,
        clip: true,
      });
    }
    
    return {
      title: {
        text: `${indexName} Historical Performance`,
        left: 'left',
        textStyle: {
          fontSize: 16,
          fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif',
          color: chartColors.foreground,
          fontWeight: 400,
        },
        padding: [0, 0, 0, 10],
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross', label: { backgroundColor: '#6a7985' } },
        backgroundColor: chartColors.card,
        borderColor: chartColors.primary,
        textStyle: {
          fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif',
          fontSize: 14,
          color: chartColors.primary,
        },
      },
      grid: { left: '3%', right: '4%', top: '60px', bottom: '12%', containLabel: true },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dates,
        axisLabel: { fontSize: 12, color: chartColors.mutedForeground },
        axisLine: { show: false },
        axisTick: { show: true, alignWithLabel: true, lineStyle: { color: chartColors.border } },
      },
      yAxis: {
        type: 'value',
        scale: true,
        axisLabel: { fontSize: 12, color: chartColors.mutedForeground },
        splitLine: { show: true, lineStyle: { color: [chartColors.primaryGradientStart] } },
        axisLine: { show: false },
      },
      series: baseOptionSeries,
      legend: {
        data: legendData,
        bottom: 5,
        left: 'center',
        textStyle: { fontSize: 13, color: chartColors.mutedForeground },
        backgroundColor: 'transparent',
      },
      dataZoom: [
        { type: 'inside', start: 0, end: 100 },
        {
          start: 0,
          end: 100,
          handleIcon:
            'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '80%',
          handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2,
          },
          bottom: '5%',
          height: 20,
          dataBackground: { lineStyle: { color: chartColors.mutedForeground, opacity: 0.3 }, areaStyle: { color: chartColors.mutedForeground, opacity: 0.1 } },
          selectedDataBackground: { lineStyle: { color: chartColors.primary, opacity: 0.7 }, areaStyle: { color: chartColors.primary, opacity: 0.3 } },
          fillerColor: `hsla(${chartColors.primaryRgb.h}, ${chartColors.primaryRgb.s}%, ${chartColors.primaryRgb.l}%, 0.2)`,
        },
      ],
      toolbox: {
        feature: {
          saveAsImage: { name: `${indexName}-chart`, title: 'Save as Image' },
          dataZoom: { title: { zoom: 'Zoom', back: 'Restore Zoom' } },
        },
        right: 20,
        iconStyle: { borderColor: chartColors.mutedForeground },
      },
      animationDuration: 400,
      animationEasing: 'cubicInOut',
    };
  }, [data, indexName, chartColors, sma50Data, sma200Data, drawnLines, activeTool, tempInteractionPoints, measurement]);

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
    return <div className="flex items-center justify-center h-full text-muted-foreground">Initializing chart style...</div>;
  }

  return (
    <div className="relative"> {/* Added relative for overlay positioning */}
      {/* Toolbar for drawing tools */}
      <div className="mb-2 flex space-x-2 p-2 bg-card rounded shadow-sm border border-border items-center">
        <Button
          variant={activeTool === 'none' ? 'secondary' : 'outline'}
          size="sm"
          onClick={() => {
            setActiveTool('none');
            setTempInteractionPoints([]);
            setMeasurement(null);
          }}
          title="Default cursor (Pan)"
        >
          <Hand className="h-4 w-4" />
        </Button>
        <Button
          variant={activeTool === 'trendline' ? 'secondary' : 'outline'}
          size="sm"
          onClick={() => {
            setActiveTool('trendline');
            setTempInteractionPoints([]);
            setMeasurement(null);
          }}
          title="Draw Trend Line"
        >
          <LineChartIcon className="h-4 w-4" />
        </Button>
        <Button
          variant={activeTool === 'measure' ? 'secondary' : 'outline'}
          size="sm"
          onClick={() => {
            setActiveTool('measure');
            setTempInteractionPoints([]);
            setMeasurement(null);
          }}
          title="Measure Change"
        >
          <Ruler className="h-4 w-4" />
        </Button>
        {(drawnLines.length > 0 || measurement || tempInteractionPoints.length > 0) && (
          <Button variant="destructive" size="sm" onClick={clearInteractions} title="Clear Drawings & Measurement">
            <Trash2 className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}
      </div>
      {/* Display Measurement Result */}
      {measurement && chartColors && (
        <div className="absolute top-16 left-2 bg-card/80 backdrop-blur-sm p-2 rounded shadow-lg border text-xs text-foreground z-20">
          <p><strong>Period:</strong> {measurement.start.date} to {measurement.end.date}</p>
          <p><strong>Start Value:</strong> {measurement.start.value.toFixed(2)}</p>
          <p><strong>End Value:</strong> {measurement.end.value.toFixed(2)}</p>
          <p><strong>Change:</strong> <span className={measurement.change >= 0 ? 'text-positive' : 'text-negative'}>{measurement.change.toFixed(2)}</span></p>
          <p><strong>% Change:</strong> <span className={measurement.percentChange >= 0 ? 'text-positive' : 'text-negative'}>{measurement.percentChange.toFixed(2)}%</span></p>
        </div>
      )}
      <ReactECharts
        ref={echartsRef}
        option={option}
        style={{ height: '100%', width: '100%', minHeight: 400, maxHeight: 500 }}
        notMerge={false}
        lazyUpdate={true}
        onEvents={{ click: handleChartClick }}
      />
    </div>
  );
};

export default NewIndexChart;
