import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  portfolioService,
  PortfolioOptimizationRequest,
  OptimizedPortfolio,
  PortfolioAllocation
} from '../services/portfolioService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const Portfolio: React.FC = () => {
  const [tickers, setTickers] = useState<string[]>(['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META']);
  const [scenario, setScenario] = useState<'bull' | 'bear' | 'volatile'>('bull');
  const [portfolio, setPortfolio] = useState<OptimizedPortfolio | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScenarioChange = (_: React.MouseEvent<HTMLElement>, newScenario: 'bull' | 'bear' | 'volatile') => {
    if (newScenario) {
      setScenario(newScenario);
    }
  };

  const optimizePortfolio = async () => {
    try {
      setLoading(true);
      setError(null);
      const request: PortfolioOptimizationRequest = {
        tickers,
        scenario
      };
      const result = await portfolioService.optimizePortfolio(request);
      setPortfolio(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to optimize portfolio');
    } finally {
      setLoading(false);
    }
  };

  const renderPieChart = (allocations: PortfolioAllocation[]) => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={allocations}
          dataKey="weight"
          nameKey="ticker"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {allocations.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => {
          if (typeof value === "number") {
            return `${value.toFixed(2)}%`;
          }
          const num = Number(value);
          return isNaN(num) ? value : `${num.toFixed(2)}%`;
        }} />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Portfolio Optimization
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ToggleButtonGroup
              value={scenario}
              exclusive
              onChange={handleScenarioChange}
              aria-label="market scenario"
              sx={{ mb: 2 }}
            >
              <ToggleButton value="bull" aria-label="bull market">
                📈 Bull Market
              </ToggleButton>
              <ToggleButton value="bear" aria-label="bear market">
                📉 Bear Market
              </ToggleButton>
              <ToggleButton value="volatile" aria-label="volatile market">
                🌪️ Volatile Market
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={optimizePortfolio}
              disabled={loading}
              sx={{ mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Optimize Portfolio'}
            </Button>
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Typography color="error">{error}</Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      {portfolio && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Optimized Portfolio Allocation
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              {renderPieChart(portfolio.allocations)}
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">
                  Expected Return: {(portfolio.totalExpectedReturn * 100).toFixed(2)}%
                </Typography>
                <Typography variant="subtitle1">
                  Portfolio Risk: {(portfolio.totalRisk * 100).toFixed(2)}%
                </Typography>
                <Typography variant="subtitle1">
                  Sharpe Ratio: {portfolio.sharpeRatio.toFixed(2)}
                </Typography>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Asset Allocation
                </Typography>
                {portfolio.allocations.map((allocation, index) => (
                  <Typography key={allocation.ticker} variant="body1">
                    {allocation.ticker}: {allocation.weight.toFixed(2)}%
                  </Typography>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
};