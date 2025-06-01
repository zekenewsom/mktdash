import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface IndicatorData {
  seriesInfo?: any;
  currentValue?: any;
  historical?: any;
  metrics?: any;
  analyticalMetrics?: any;
  marketCap?: number;
  totalVolume?: number;
  error?: string;
}

async function fetchIndicatorDetails(indicatorId: string, type: 'crypto' | 'series') {
  if (!indicatorId) throw new Error('Missing indicatorId');
  const endpoint = type === 'crypto'
    ? `/api/crypto/${indicatorId}`
    : `/api/series/${indicatorId}`;
  const res = await axios.get(endpoint);
  if (res.data?.error && !res.data?.data) {
    throw new Error(res.data.error);
  }
  return res.data?.data || null;
}

export function useIndicatorDetails(indicatorId: string, type: 'crypto' | 'series') {
  const {
    data,
    isLoading,
    error,
  } = useQuery<IndicatorData | null, Error>({
    queryKey: ['indicator-details', indicatorId, type],
    queryFn: () => fetchIndicatorDetails(indicatorId, type),
    enabled: !!indicatorId,
    gcTime: 5 * 60 * 1000, // 5 minutes
    staleTime: 60 * 1000, // 1 minute
    retry: 1,
  });

  return { data, isLoading, error: error?.message || null };
}
