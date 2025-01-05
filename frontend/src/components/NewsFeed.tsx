import React, { useEffect, useState } from 'react';
import { NewsItem, newsService } from '../services/newsService';
import { NewsCard } from './NewsCard';

interface NewsFeedProps {
  ticker: string;
  refreshInterval?: number;
}

export const NewsFeed: React.FC<NewsFeedProps> = ({ ticker, refreshInterval = 300000 }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      const newsData = await newsService.getNews(ticker);
      setNews(newsData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch news');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, refreshInterval);
    return () => clearInterval(interval);
  }, [ticker, refreshInterval]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Latest News for {ticker}</h2>
      {news.map((item, index) => (
        <NewsCard key={index} news={item} />
      ))}
    </div>
  );
};