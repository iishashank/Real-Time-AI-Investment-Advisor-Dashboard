import { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Box,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface Holding {
  symbol: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  gain: number;
  gainPercentage: number;
}

interface PortfolioMetrics {
  totalValue: number;
  totalGain: number;
  gainPercentage: number;
  riskLevel: string;
  diversificationScore: number;
}

export default function Portfolio() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [metrics, setMetrics] = useState<PortfolioMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch portfolio data
    const fetchPortfolioData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock data
      setHoldings([
        {
          symbol: 'AAPL',
          shares: 10,
          avgPrice: 150.00,
          currentPrice: 175.50,
          value: 1755.00,
          gain: 255.00,
          gainPercentage: 17.00
        },
        {
          symbol: 'GOOGL',
          shares: 5,
          avgPrice: 2800.00,
          currentPrice: 2750.00,
          value: 13750.00,
          gain: -250.00,
          gainPercentage: -1.79
        },
        {
          symbol: 'MSFT',
          shares: 15,
          avgPrice: 280.00,
          currentPrice: 310.00,
          value: 4650.00,
          gain: 450.00,
          gainPercentage: 10.71
        }
      ]);

      setMetrics({
        totalValue: 20155.00,
        totalGain: 455.00,
        gainPercentage: 2.31,
        riskLevel: 'Moderate',
        diversificationScore: 75
      });

      setLoading(false);
    };

    fetchPortfolioData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
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
      <Typography variant="h4" gutterBottom>
        Investment Portfolio
      </Typography>

      {metrics && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Value
              </Typography>
              <Typography variant="h5">
                {formatCurrency(metrics.totalValue)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Gain/Loss
              </Typography>
              <Typography
                variant="h5"
                color={metrics.totalGain >= 0 ? 'success.main' : 'error.main'}
              >
                {formatCurrency(metrics.totalGain)}
                <Typography component="span" variant="body2" sx={{ ml: 1 }}>
                  ({formatPercentage(metrics.gainPercentage)})
                </Typography>
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Risk Level
              </Typography>
              <Typography variant="h5">
                {metrics.riskLevel}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Diversification
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h5">
                  {metrics.diversificationScore}/100
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell align="right">Shares</TableCell>
              <TableCell align="right">Avg Price</TableCell>
              <TableCell align="right">Current Price</TableCell>
              <TableCell align="right">Value</TableCell>
              <TableCell align="right">Gain/Loss</TableCell>
              <TableCell align="right">Performance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {holdings.map((holding) => (
              <TableRow key={holding.symbol}>
                <TableCell component="th" scope="row">
                  <Typography variant="body1" fontWeight="bold">
                    {holding.symbol}
                  </Typography>
                </TableCell>
                <TableCell align="right">{holding.shares}</TableCell>
                <TableCell align="right">{formatCurrency(holding.avgPrice)}</TableCell>
                <TableCell align="right">{formatCurrency(holding.currentPrice)}</TableCell>
                <TableCell align="right">{formatCurrency(holding.value)}</TableCell>
                <TableCell align="right">
                  <Typography
                    color={holding.gain >= 0 ? 'success.main' : 'error.main'}
                  >
                    {formatCurrency(holding.gain)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Chip
                    icon={holding.gain >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                    label={formatPercentage(holding.gainPercentage)}
                    color={holding.gain >= 0 ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </motion.div>
  );
}