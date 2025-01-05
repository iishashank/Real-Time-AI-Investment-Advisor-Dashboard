import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Slider,
  Button,
  Paper,
  Grid,
  CircularProgress
} from '@mui/material';
import { api } from '../services/api';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

interface RiskFormData {
  age: number;
  income: number;
  volatilityTolerance: number;
  investmentHorizon: number;
}

interface RiskResult {
  riskProfile: string;
  cluster: number;
  confidence: number;
  inputs: RiskFormData;
}

const initialFormData: RiskFormData = {
  age: 30,
  income: 60000,
  volatilityTolerance: 5,
  investmentHorizon: 10
};

export const RiskForm: React.FC = () => {
  const [formData, setFormData] = useState<RiskFormData>(initialFormData);
  const [result, setResult] = useState<RiskResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTextChange = (field: keyof RiskFormData) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: Number(event.target.value) }));
  };

  const handleSliderChange = (field: keyof RiskFormData) => (_: Event, value: number | number[]) => {
    if (typeof value === 'number') {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post<RiskResult>('/api/profile/predict', formData);
      setResult(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getRadarData = (data: RiskFormData) => [
    { subject: 'Age', value: data.age / 80 * 10 },
    { subject: 'Income', value: data.income / 100000 * 10 },
    { subject: 'Risk Tolerance', value: data.volatilityTolerance },
    { subject: 'Investment Horizon', value: data.investmentHorizon / 30 * 10 }
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Risk Profiling Questionnaire
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Age"
              type="number"
              value={formData.age}
              onChange={handleTextChange('age')}
              InputProps={{ inputProps: { min: 18, max: 100 } }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Annual Income ($)"
              type="number"
              value={formData.income}
              onChange={handleTextChange('income')}
              InputProps={{ inputProps: { min: 0, max: 1000000 } }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography gutterBottom>Risk Tolerance (1-10)</Typography>
            <Slider
              value={formData.volatilityTolerance}
              onChange={handleSliderChange('volatilityTolerance')}
              min={1}
              max={10}
              step={1}
              marks
              valueLabelDisplay="auto"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Investment Horizon (Years)"
              type="number"
              value={formData.investmentHorizon}
              onChange={handleTextChange('investmentHorizon')}
              InputProps={{ inputProps: { min: 1, max: 30 } }}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Analyze Risk Profile'}
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Paper>

      {result && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Your Risk Profile: {result.riskProfile}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Confidence Score: {(result.confidence * 100).toFixed(1)}%
          </Typography>
          
          <Box sx={{ height: 300, mt: 3 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={getRadarData(result.inputs)}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <Radar
                  name="Risk Profile"
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      )}
    </Box>
  );
};