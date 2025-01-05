import { useState, useEffect } from 'react';
import {
  Typography,
    Paper,
  Box,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Divider,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import { useAppContext } from '../context/AppContext';

interface FeatureImportance {
  feature: string;
  importance: number;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

interface Decision {
  recommendation: string;
  confidence: number;
  reasoning: string[];
  keyMetrics: {
    name: string;
    value: string;
    trend: 'up' | 'down' | 'neutral';
  }[];
}

export default function Explainability() {
  const { ticker } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [features, setFeatures] = useState<FeatureImportance[]>([]);
  const [decision, setDecision] = useState<Decision | null>(null);

  useEffect(() => {
    const fetchExplanation = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock data
      setFeatures([
        {
          feature: 'Price Momentum',
          importance: 85,
          impact: 'positive',
          description: 'Strong upward trend in recent price movements'
        },
        {
          feature: 'Volume Analysis',
          importance: 75,
          impact: 'positive',
          description: 'Increased trading volume supporting price action'
        },
        {
          feature: 'Market Sentiment',
          importance: 65,
          impact: 'neutral',
          description: 'Mixed sentiment signals from market participants'
        },
        {
          feature: 'Technical Indicators',
          importance: 80,
          impact: 'negative',
          description: 'Overbought conditions in technical indicators'
        },
      ]);

      setDecision({
        recommendation: 'HOLD',
        confidence: 75,
        reasoning: [
          'Strong momentum but approaching resistance levels',
          'Volume supports current trend but showing signs of weakening',
          'Technical indicators suggest potential short-term pullback',
          'Market sentiment remains mixed with cautious outlook'
        ],
        keyMetrics: [
          { name: 'RSI', value: '68.5', trend: 'up' },
          { name: 'MACD', value: '1.23', trend: 'down' },
          { name: 'Moving Average', value: '157.30', trend: 'up' }
        ]
      });

      setLoading(false);
    };

    fetchExplanation();
  }, [ticker]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' }}>
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
        AI Decision Explanation
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7} sx={{ overflowX: 'auto' }}>
          <Paper elevation={3} sx={{ p: 3, height: '100%', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' }}>
            <Typography variant="h6" gutterBottom>
              Feature Importance Analysis
            </Typography>
            <List>
              {features.map((feature, index) => (
                <motion.div
                  key={feature.feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ListItem>
                    <ListItemIcon>
                      {feature.impact === 'positive' && <TrendingUpIcon color="success" />}
                      {feature.impact === 'negative' && <TrendingDownIcon color="error" />}
                      {feature.impact === 'neutral' && <TimelineIcon color="action" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle1">{feature.feature}</Typography>
                          <Chip
                            label={`${feature.importance}%`}
                            size="small"
                            color={feature.impact === 'positive' ? 'success' : 
                                  feature.impact === 'negative' ? 'error' : 'default'}
                          />
                        </Box>
                      }
                      secondary={feature.description}
                    />
                  </ListItem>
                  {index < features.length - 1 && <Divider variant="inset" component="li" />}
                </motion.div>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          {decision && (
            <Paper elevation={3} sx={{ p: 3, backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' }}>
              <Typography variant="h6" gutterBottom>
                Decision Summary
              </Typography>
              
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Typography variant="h4" color="primary" gutterBottom>
                  {decision.recommendation}
                </Typography>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <CircularProgress
                    variant="determinate"
                    value={decision.confidence}
                    size={80}
                    thickness={4}
                    sx={{ color: 'primary.main' }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="caption" component="div" color="text.secondary">
                      {`${decision.confidence}%`}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Confidence Score
                </Typography>
              </Box>

              <Typography variant="subtitle1" gutterBottom>
                Key Metrics
              </Typography>
              <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {decision.keyMetrics.map((metric) => (
                  <Chip
                    key={metric.name}
                    icon={metric.trend === 'up' ? <TrendingUpIcon /> : 
                          metric.trend === 'down' ? <TrendingDownIcon /> : 
                          <ShowChartIcon />}
                    label={`${metric.name}: ${metric.value}`}
                    color={metric.trend === 'up' ? 'success' : 
                           metric.trend === 'down' ? 'error' : 'default'}
                    variant="outlined"
                  />
                ))}
              </Box>

              <Typography variant="subtitle1" gutterBottom>
                Reasoning
              </Typography>
              <List dense>
                {decision.reasoning.map((reason, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <PriorityHighIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={reason} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Grid>
      </Grid>
    </motion.div>
  );
}