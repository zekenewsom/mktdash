import { fetchIndexPerformance, getSeriesDetails } from './marketDataService';
import { fetchMacroData } from './fredService';

interface SnapshotIndicator {
  id: string;
  name: string;
  value?: number | string | null;
  changePercent?: number | null;
  date?: string | null;
  unit?: string;
}

interface HomeSnapshot {
  markets: SnapshotIndicator[];
  economic: SnapshotIndicator[];
  financialStability: SnapshotIndicator[];
}

async function getIndicatorSnapshot(seriesId: string, name: string, unit: string = ''): Promise<SnapshotIndicator> {
  try {
    const result = await getSeriesDetails(seriesId);
    if (result.data && result.data.currentValue) {
      return {
        id: seriesId,
        name: result.data.seriesInfo?.title || name,
        value: result.data.currentValue.value,
        changePercent: result.data.metrics?.['1D']?.percentChange,
        date: result.data.currentValue.date,
        unit: result.data.seriesInfo?.units_short || unit,
      };
    }
  } catch (error) {
    console.error(`Error fetching snapshot for ${seriesId}:`, error);
  }
  return { id: seriesId, name, value: 'N/A' };
}

// GaugeData and HomeSnapshot interfaces extended for gauges
interface GaugeData {
  value: number; // 0-100 scale
  name: string;
  rawValueDisplay?: string; // e.g., "2.5%" for GDP raw value
  unit?: string;
}
interface HomeSnapshot {
  markets: SnapshotIndicator[];
  economic: SnapshotIndicator[];
  financialStability: SnapshotIndicator[];
  marketGauge?: GaugeData;
  economicGauge?: GaugeData;
  stabilityGauge?: GaugeData;
}

export async function getHomeSnapshotData(): Promise<{ data: HomeSnapshot | null; error?: string }> {
  try {
    const snapshot: HomeSnapshot = {
      markets: [],
      economic: [],
      financialStability: [],
    };

    // --- Market Snapshot Indicators ---
    const indexPerformance = await fetchIndexPerformance();
    if (indexPerformance.data) {
      if (indexPerformance.data.SP500) {
        snapshot.markets.push({
          id: 'SP500', name: 'S&P 500',
          value: indexPerformance.data.SP500.value,
          changePercent: indexPerformance.data.SP500.percentChange,
          date: indexPerformance.data.SP500.date,
        });
      }
      if (indexPerformance.data.NASDAQCOM) {
        snapshot.markets.push({
          id: 'NASDAQCOM', name: 'Nasdaq Comp.',
          value: indexPerformance.data.NASDAQCOM.value,
          changePercent: indexPerformance.data.NASDAQCOM.percentChange,
          date: indexPerformance.data.NASDAQCOM.date,
        });
      }
    }
    snapshot.markets.push(await getIndicatorSnapshot('DGS10', '10-Yr Treasury', '%'));
    snapshot.markets.push(await getIndicatorSnapshot('DCOILWTICO', 'WTI Crude Oil', '$/Bbl'));

    // --- Economic Snapshot Indicators ---
    const macroData = await fetchMacroData(['CPIAUCSL', 'UNRATE', 'FEDFUNDS']);
    if (macroData.data) {
      if (macroData.data.CPIAUCSL) snapshot.economic.push({ id: 'CPIAUCSL', name: 'CPI', value: macroData.data.CPIAUCSL.value, date: macroData.data.CPIAUCSL.date, unit: 'Index' });
      if (macroData.data.UNRATE) snapshot.economic.push({ id: 'UNRATE', name: 'Unemployment Rate', value: macroData.data.UNRATE.value, date: macroData.data.UNRATE.date, unit: '%' });
      if (macroData.data.FEDFUNDS) snapshot.economic.push({ id: 'FEDFUNDS', name: 'Fed Funds Rate', value: macroData.data.FEDFUNDS.value, date: macroData.data.FEDFUNDS.date, unit: '%' });
    } else {
      snapshot.economic.push(await getIndicatorSnapshot('CPIAUCSL', 'CPI', 'Index'));
      snapshot.economic.push(await getIndicatorSnapshot('UNRATE', 'Unemployment Rate', '%'));
      snapshot.economic.push(await getIndicatorSnapshot('FEDFUNDS', 'Fed Funds Rate', '%'));
    }

    // --- Financial Stability Snapshot Indicators ---
    snapshot.financialStability.push(await getIndicatorSnapshot('DRCCLACBS', 'Credit Card Delinquency', '%'));
    snapshot.financialStability.push(await getIndicatorSnapshot('TDSP', 'Household Debt Service Ratio', '%'));
    snapshot.financialStability.push(await getIndicatorSnapshot('SOFR', 'SOFR', '%'));

    // --- Overview Gauges ---
    // 1. Market Sentiment Gauge: % of S&P 500, NASDAQ, DJIA with positive 1-day % change
    try {
      let upCount = 0, total = 0;
      const indices = ['SP500', 'NASDAQCOM', 'DJIA'] as const;
      type IndexKey = typeof indices[number];
      for (const idx of indices) {
        const perf = indexPerformance.data?.[idx as IndexKey];
        if (perf && typeof perf.percentChange === 'number') {
          total++;
          if (perf.percentChange > 0) upCount++;
        }
      }
      if (total > 0) {
        snapshot.marketGauge = {
          value: Math.round((upCount / total) * 100),
          name: 'Market Sentiment',
          rawValueDisplay: `${upCount}/${total} Up`,
          unit: '',
        };
      }
    } catch (err) {
      console.error('Error calculating marketGauge:', err);
    }

    // 2. Economic Strength Gauge: Normalized Real GDP quarterly growth rate (A191RL1Q225SBEA)
    try {
      const gdpRes = await getSeriesDetails('A191RL1Q225SBEA');
      const gdpGrowth = gdpRes.data?.currentValue?.value;
      if (typeof gdpGrowth === 'number') {
        // Normalize: -2% (0) to +6% (100)
        const min = -2, max = 6;
        let norm = ((gdpGrowth - min) / (max - min)) * 100;
        norm = Math.max(0, Math.min(100, norm));
        snapshot.economicGauge = {
          value: Math.round(norm),
          name: 'Economic Strength',
          rawValueDisplay: `${gdpGrowth.toFixed(2)}%`,
          unit: '',
        };
      }
    } catch (err) {
      console.error('Error calculating economicGauge:', err);
    }

    // 3. Financial Stability Gauge: Normalized BAA10Y spread (0.5=100, 3.5=0)
    try {
      const spreadRes = await getSeriesDetails('BAA10Y');
      const spread = spreadRes.data?.currentValue?.value;
      if (typeof spread === 'number') {
        // Normalize: 0.5 (safe) to 3.5 (risky)
        const min = 0.5, max = 3.5;
        let norm = ((max - spread) / (max - min)) * 100;
        norm = Math.max(0, Math.min(100, norm));
        snapshot.stabilityGauge = {
          value: Math.round(norm),
          name: 'Financial Stability',
          rawValueDisplay: `${spread.toFixed(2)}%`,
          unit: '',
        };
      }
    } catch (err) {
      console.error('Error calculating stabilityGauge:', err);
    }

    return { data: snapshot };
  } catch (error: any) {
    console.error('Error fetching home snapshot data:', error);
    return { data: null, error: error.message || 'Failed to fetch snapshot data' };
  }
}
