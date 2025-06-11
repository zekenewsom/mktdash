import React from 'react';
import { NewsArticle } from '../../api/newsApi';
import { format } from 'date-fns';

interface Props {
  article: NewsArticle;
}

const sentimentColor = (label: string) => {
  switch (label) {
    case 'Positive': return 'text-green-600';
    case 'Negative': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

export const NewsItemCard: React.FC<Props> = ({ article }) => {
  return (
    <div className="bg-white rounded shadow p-4 flex gap-4 mb-4">
      <div className="flex-shrink-0 w-32 h-20 bg-gray-100 rounded overflow-hidden">
        {article.banner_image ? (
          <img src={article.banner_image} alt="news banner" className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
        )}
      </div>
      <div className="flex-1">
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold hover:underline">
          {article.title}
        </a>
        <div className="text-xs text-gray-500 mt-1">
          {article.source} &bull; {format(new Date(article.time_published), 'yyyy-MM-dd HH:mm')}
        </div>
        <div className="mt-2 text-sm text-gray-700 line-clamp-3">{article.summary}</div>
        <div className="mt-2 flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${sentimentColor(article.overall_sentiment_label)} bg-gray-100`}>
            {article.overall_sentiment_label} ({article.overall_sentiment_score})
          </span>
        </div>
      </div>
    </div>
  );
};
