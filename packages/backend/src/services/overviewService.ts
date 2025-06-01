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

export async function getHomeSnapshotData(): Promise<{ data: HomeSnapshot | null; error?: string }> {
  try {
    const snapshot: HomeSnapshot = {
      markets: [],
      economic: [],
      financialStability: [],
    };

    // --- Market Snapshot ---
    const indexPerformance = await fetchIndexPerformance();
    if (indexPerformance.data) {
      if (indexPerformance.data.SP500) {
        snapshot.markets.push({
          id: 'SP500',
          name: 'S&P 500',
          value: indexPerformance.data.SP500.value,
          changePercent: indexPerformance.data.SP500.percentChange,
          date: indexPerformance.data.SP500.date,
        });
      }
      if (indexPerformance.data.NASDAQCOM) {
        snapshot.markets.push({
          id: 'NASDAQCOM',
          name: 'Nasdaq Comp.',
          value: indexPerformance.data.NASDAQCOM.value,
          changePercent: indexPerformance.data.NASDAQCOM.percentChange,
          date: indexPerformance.data.NASDAQCOM.date,
        });
      }
    }
    snapshot.markets.push(await getIndicatorSnapshot('DGS10', '10-Yr Treasury', '%'));
    snapshot.markets.push(await getIndicatorSnapshot('DCOILWTICO', 'WTI Crude Oil', '$/Bbl'));

    // --- Economic Snapshot ---
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

    // --- Financial Stability Snapshot ---
    snapshot.financialStability.push(await getIndicatorSnapshot('DRCCLACBS', 'Credit Card Delinquency', '%'));
    snapshot.financialStability.push(await getIndicatorSnapshot('TDSP', 'Household Debt Service Ratio', '%'));
    snapshot.financialStability.push(await getIndicatorSnapshot('SOFR', 'SOFR', '%'));

    return { data: snapshot };
  } catch (error: any) {
    console.error('Error fetching home snapshot data:', error);
    return { data: null, error: error.message || 'Failed to fetch snapshot data' };
  }
}
