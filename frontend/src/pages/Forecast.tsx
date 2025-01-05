import { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Box,
  Grid,
  CircularProgress,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { useAppContext } from '../context/AppContext';

interface ForecastData {
  timestamp: string;
  predicted: number;
  upperBound: number;
  lowerBound: number;
  confidence: number;
}

interface TrendAnalysis {
  direction: 'up' | 'down' | 'sideways';
  strength: number;
  keyLevels: {
    support: number;
    resistance: number;
  };
  indicators: {
    name: string;
    value: string;
    signal: 'buy' | 'sell' | 'neutral';
  }[];
}

export default function Forecast() {
  const { ticker } = useAppContext();
  const [timeframe, setTimeframe] = useState<string>('1w');
  const [loading, setLoading] = useState(true);
  const [forecasts, setForecasts] = useState<ForecastData[]>([]);
  const [trend, setTrend] = useState<TrendAnalysis | null>(null);

  useEffect(() => {
    const fetchForecastData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock forecast data
      const mockForecasts: ForecastData[] = [
        {
          timestamp: '2024-01-20',
          predicted: 185.50,
          upperBound: 190.25,
          lowerBound: 180.75,
          confidence: 85
        },
        {
          timestamp: '2024-01-21',
          predicted: 187.25,
          upperBound: 192.50,
          lowerBound: 182.00,
          confidence: 82
        },
        {
          timestamp: '2024-01-22',
          predicted: 189.00,
          upperBound: 194.75,
          lowerBound: 183.25,
          confidence: 80
        }
      ];

      const mockTrend: TrendAnalysis = {
        direction: 'up',
        strength: 75,
        keyLevels: {
          support: 175.50,
          resistance: 195.00
        },
        indicators: [
          { name: 'RSI', value: '65', signal: 'neutral' },
          { name: 'MACD', value: '2.5', signal: 'buy' },
          { name: 'MA Cross', value: 'Golden', signal: 'buy' }
        ]
      };

      setForecasts(mockForecasts);
      setTrend(mockTrend);
      setLoading(false);
    };

    fetchForecastData();
  }, [ticker, timeframe]);

  const handleTimeframeChange = (event: React.MouseEvent<HTMLElement>, newTimeframe: string) => {
    if (newTimeframe !== null) {
      setTimeframe(newTimeframe);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Price Forecast
        </Typography>
        <ToggleButtonGroup
          value={timeframe}
          exclusive
          onChange={handleTimeframeChange}
          aria-label="forecast timeframe"
          size="small"
        >
          <ToggleButton value="1w" aria-label="1 week">
            1W
          </ToggleButton>
          <ToggleButton value="2w" aria-label="2 weeks">
            2W
          </ToggleButton>
          <ToggleButton value="1m" aria-label="1 month">
            1M
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Price Predictions
            </Typography>
            <Box sx={{ mt: 2 }}>
              {forecasts.map((forecast, index) => (
                <motion.div
                  key={forecast.timestamp}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle1">
                        {new Date(forecast.timestamp).toLocaleDateString()}
                      </Typography>
                      <Chip
                        label={`${forecast.confidence}% confidence`}
                        color="primary"
                        size="small"
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="h5" color="primary">
                        {formatCurrency(forecast.predicted)}
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography variant="caption" color="success.main">
                          High: {formatCurrency(forecast.upperBound)}
                        </Typography>
                        <Typography variant="caption" color="error.main">
                          Low: {formatCurrency(forecast.lowerBound)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          {trend && (
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Trend Analysis
              </Typography>
              
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  {trend.direction === 'up' ? (
                    <TrendingUpIcon color="success" fontSize="large" />
                  ) : (
                    <TrendingDownIcon color="error" fontSize="large" />
                  )}
                  <Typography variant="h5" color={trend.direction === 'up' ? 'success.main' : 'error.main'}>
                    {trend.direction.toUpperCase()}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Trend Strength: {trend.strength}%
                </Typography>
              </Box>

              <Typography variant="subtitle2" gutterBottom>
                Key Price Levels
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2">
                  Support: {formatCurrency(trend.keyLevels.support)}
                </Typography>
                <Typography variant="body2">
                  Resistance: {formatCurrency(trend.keyLevels.resistance)}
                </Typography>
              </Box>

              <Typography variant="subtitle2" gutterBottom>
                Technical Indicators
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {trend.indicators.map((indicator) => (
                  <Chip
                    key={indicator.name}
                    label={`${indicator.name}: ${indicator.value}`}
                    color={indicator.signal === 'buy' ? 'success' :
                           indicator.signal === 'sell' ? 'error' : 'default'}
                    size="small"
                  />
                ))}
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>
    </motion.div>
  );
}