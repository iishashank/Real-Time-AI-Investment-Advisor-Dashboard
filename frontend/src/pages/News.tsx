import React, { useState } from 'react';
import { Card, CardContent, Typography, Chip, TextField, Button, Box, Container } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { newsService } from '../services/api';

interface NewsItem {
  title: string;
  published: string;
  link: string;
  sentiment: number;
}

const sentimentEmoji = (score: number): string => {
  if (score >= 0.4) return '📈 Positive';
  if (score <= -0.4) return '📉 Negative';
  return '😐 Neutral';
};

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [ticker, setTicker] = useState('AAPL');

  const [loading, setLoading] = useState(false);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await newsService.getNews(ticker);
      setNews(data);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const trend = news.map((n, i) => ({
    time: `#${i + 1}`,
    score: n.sentiment,
  }));

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          label="Stock Ticker"
          variant="outlined"
          size="small"
        />
        <Button
          variant="contained"
          onClick={fetchNews}
          disabled={loading}
          sx={{ minWidth: 120 }}
        >
          {loading ? 'Loading...' : 'Get News'}
        </Button>
      </Box>

      {trend.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Sentiment Trend
          </Typography>
          <Box sx={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <XAxis dataKey="time" />
                <YAxis domain={[-1, 1]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#8884d8"
                  dot={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      )}

      {news.map((item, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {item.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {new Date(item.published).toLocaleDateString()}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
              <Chip
                label={sentimentEmoji(item.sentiment)}
                color={
                  item.sentiment > 0.4
                    ? 'success'
                    : item.sentiment < -0.4
                    ? 'error'
                    : 'warning'
                }
              />
              <Typography variant="body2" color="text.secondary">
                Sentiment Score: {item.sentiment.toFixed(2)}
              </Typography>
            </Box>
            <Typography variant="body2">
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#1976d2', textDecoration: 'none' }}
              >
                Read More
              </a>
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}