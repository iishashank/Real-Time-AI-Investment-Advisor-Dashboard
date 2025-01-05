import React from 'react';
import { NewsItem } from '../services/newsService';

interface NewsCardProps {
  news: NewsItem;
}

const getSentimentEmoji = (sentiment: number): string => {
  if (sentiment >= 0.05) return '📈';
  if (sentiment <= -0.05) return '📉';
  return '➡️';
};

const getSentimentColor = (sentiment: number): string => {
  if (sentiment >= 0.05) return 'text-green-600';
  if (sentiment <= -0.05) return 'text-red-600';
  return 'text-gray-600';
};

export const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const sentimentEmoji = getSentimentEmoji(news.sentiment);
  const sentimentColor = getSentimentColor(news.sentiment);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold flex-grow">
          <a href={news.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
            {news.title}
          </a>
        </h3>
        <span className="text-2xl ml-2" title={`Sentiment: ${news.sentiment.toFixed(2)}`}>
          {sentimentEmoji}
        </span>
      </div>
      <div className="mt-2 flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {new Date(news.published).toLocaleDateString()}
        </span>
        <span className={`text-sm font-medium ${sentimentColor}`}>
          Sentiment: {news.sentiment.toFixed(2)}
        </span>
      </div>
    </div>
  );
};