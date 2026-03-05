import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchNews, FetchNewsOptions, NewsArticle } from '../api/newsApi';

export const useMarketNews = (
  options: FetchNewsOptions = {},
  queryOptions: { enabled?: boolean } = {}
): UseQueryResult<NewsArticle[], Error> => {
  return useQuery<NewsArticle[], Error, NewsArticle[], any>({
    queryKey: ['marketNews', options],
    queryFn: () => fetchNews(options),
    enabled: queryOptions.enabled !== undefined ? queryOptions.enabled : true,
    // Optionally add staleTime or cacheTime here
    // staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
