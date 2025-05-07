import axios from 'axios';

const FRED_API_KEY = process.env.FRED_API_KEY;
const FRED_BASE_URL = 'https://api.stlouisfed.org/fred/series/observations';

const INDEX_SERIES = {
  SP500: 'SP500',       // S&P 500 Index
  NASDAQ: 'NASDAQCOM', // Nasdaq Composite
  DOWJONES: 'DJIA',    // Dow Jones Industrial Average
};

const MOCK_DATA = {
  SP500: { value: 5200.12, date: '2025-05-01' },
  NASDAQ: { value: 16000.56, date: '2025-05-01' },
  DOWJONES: { value: 35000.78, date: '2025-05-01' },
};

type IndexKey = keyof typeof INDEX_SERIES;

async function fetchFredIndex(seriesId: string) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const url = `${FRED_BASE_URL}?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&observation_end=${today}`;
  try {
    const resp = await axios.get(url);
    const obsArr = resp.data.observations || [];
    const obs = obsArr.length > 0 ? obsArr[obsArr.length - 1] : undefined;
    if (obs && obs.value !== '.') {
      return { value: parseFloat(obs.value), date: obs.date };
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}

export async function fetchIndexPerformance() {
  try {
    const results: Record<IndexKey, any> = {} as Record<IndexKey, any>;
    for (const key of Object.keys(INDEX_SERIES) as IndexKey[]) {
      const seriesId = INDEX_SERIES[key];
      const data = await fetchFredIndex(seriesId);
      results[key] = data || MOCK_DATA[key];
    }
    return { data: results, error: null };
  } catch (err: any) {
    return { data: MOCK_DATA, error: err.message || 'API error, using mock data' };
  }
}
