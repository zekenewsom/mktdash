import React from 'react';
import { useMarketNews } from '../../hooks/useMarketNews';
import { NewsArticle, FetchNewsOptions } from '../../api/newsApi';
import { NewsItemCard } from './NewsItemCard';

interface Props {
  options?: FetchNewsOptions;
  limit?: number;
}

export const NewsFeed: React.FC<Props> = ({ options = {}, limit }) => {
  const { data, isLoading, isError, error } = useMarketNews(options);

  if (isLoading) return <div className="py-8 text-center text-gray-500">Loading news...</div>;
  if (isError) return <div className="py-8 text-center text-red-500">Error: {error?.message || 'Could not load news.'}</div>;
  if (!data || data.length === 0) return <div className="py-8 text-center text-gray-400">No news found for your criteria.</div>;

  const articles = limit ? data.slice(0, limit) : data;

  return (
    <div>
      {articles.map((article: NewsArticle, idx: number) => (
        <NewsItemCard key={article.url + idx} article={article} />
      ))}
    </div>
  );
};
