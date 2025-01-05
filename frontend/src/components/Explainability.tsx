import Heatmap from './Heatmap';
import LiveChart from './LiveChart';
import RiskCategory from './RiskCategory';
import RecommendationList from './RecommendationList';
import ExpectedReturns from './ExpectedReturns';
import SuggestedRebalance from './SuggestedRebalance';
import SimulationSliders from './SimulationSliders';
import HistoricalData from './HistoricalData';

// React and core imports
import React, { useState, useEffect } from 'react';

// Material-UI components
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Grid,
  CircularProgress 
} from '@mui/material';

// Recharts components
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Local services
import {
  getShapExplanation,
  getLimeExplanation,
  getWhyAssetExplanation,
  type LimeResponse,
  type WhyAssetResponse
} from '../services/explainabilityService';

interface ExplainabilityProps {
  formData: {
    age: number;
    income: number;
    volatility: number;
    horizon: number;
  };
  selectedAsset?: string;
}

interface ShapData {
  name: string;
  value: number;
}

interface LimeData {
  feature: string;
  contribution: number;
}

interface WhyAssetData {
  asset: string;
  reasons: string[];
  contributions: Array<{
    feature: string;
    contribution: number;
  }>;
}

export const Explainability: React.FC<ExplainabilityProps> = ({ formData, selectedAsset }) => {
  const [shapData, setShapData] = useState<ShapData[]>([]);
  const [limeData, setLimeData] = useState<LimeData[]>([]);
  const [whyAssetData, setWhyAssetData] = useState<WhyAssetData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const explain = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get SHAP explanation
      const shapResponse = await getShapExplanation({
        features: [formData.age, formData.income, formData.volatility, formData.horizon]
      });
      setShapData(Object.entries(shapResponse.feature_importance).map(([key, value]) => ({
        name: key,
        value: value as number
      })));

      // Get LIME explanation
      const limeResponse = await getLimeExplanation({
        features: [formData.age, formData.income, formData.volatility, formData.horizon]
      });
      setLimeData(limeResponse.feature_contributions);

      // Get 'Why This Asset?' explanation if an asset is selected
      if (selectedAsset) {
        const whyAssetResponse = await getWhyAssetExplanation({
          features: [formData.age, formData.income, formData.volatility, formData.horizon],
          asset_name: selectedAsset
        });
        setWhyAssetData(whyAssetResponse);
      }
    } catch (error) {
      setError('Failed to fetch explanations. Please try again.');
      console.error('Error fetching explanations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={explain} 
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Explain Portfolio Decisions'}
        </Button>
        {error && (
          <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              SHAP - Global Feature Importance
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={shapData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              LIME - Local Feature Impact
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={limeData}>
                <XAxis dataKey="feature" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="contribution" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {whyAssetData && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Why did AI choose {whyAssetData.asset}?
              </Typography>
              <ul>
                {whyAssetData.reasons.map((reason, index) => (
                  <li key={index}>
                    <Typography variant="body1">{reason}</Typography>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};