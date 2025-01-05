import { api } from './api';

export interface NewsItem {
  title: string;
  link: string;
  published: string;
  sentiment: number;
}

export const newsService = {
  getNews: async (ticker: string): Promise<NewsItem[]> => {
    const response = await api.get<NewsItem[]>(`/api/news?ticker=${ticker}`);
    return response.data;
  }
};