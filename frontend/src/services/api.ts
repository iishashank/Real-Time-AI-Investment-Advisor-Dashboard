import axios from 'axios';

export interface NewsItem {
  title: string;
  published: string;
  link: string;
  sentiment: number;
}

export interface StockPrediction {
  ticker: string;
  forecast: Array<{
    day: number;
    price: number;
    upper: number;
    lower: number;
  }>;
  trend: 'UP' | 'DOWN';
  last_price: number;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

interface ShapRequest {
  features: number[];
}

interface PortfolioShapRequest {
  portfolio_features: number[][];
}

interface LimeRequest {
  features: number[];
}

interface WhyAssetRequest {
  features: number[];
  asset_name: string;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export interface RiskFormData {
  age: number;
  income: number;
  volatilityTolerance: number;
  investmentHorizon: number;
}

export interface RiskResult {
  riskProfile: string;
  cluster: number;
  confidence: number;
  inputs: RiskFormData;
}

export const stockService = {
  getPrediction: async (ticker: string): Promise<StockPrediction> => {
    const response = await api.get<StockPrediction>(`/api/stock/predict?ticker=${ticker}`);
    return response.data;
  },
  
  getHistoricalData: async (ticker: string, period: string = '1y') => {
    const response = await api.get(`/api/stock/historical?ticker=${ticker}&period=${period}`);
    return response.data;
  },

  getRealTimePrice: async (ticker: string) => {
    const response = await api.get(`/api/stock/price?ticker=${ticker}`);
    return response.data;
  }
};

export const profileService = {
  predictRiskProfile: async (formData: RiskFormData): Promise<RiskResult> => {
    const response = await api.post<RiskResult>('/api/profile/predict', formData);
    return response.data;
  }
};

export const newsService = {
  getNews: async (ticker: string) => {
    const response = await api.get(`/api/news/${ticker}`);
    return response.data;
  }
};

export interface SystemStatus {
  api_health: {
    status: 'healthy' | 'degraded' | 'down' | 'error';
    latency: number;
    last_check: string | number;
  };
  ml_services: {
    model_status: 'ready' | 'training' | 'error' | 'down';
    last_sync: string | number;
    model_version: string;
  };
  external_apis: {
    alpha_vantage: {
      status: 'operational' | 'limited' | 'down' | 'error';
      rate_limit_remaining: number;
      reset_time: string | number;
    };
  };
  system_metrics?: {
    cpu_usage?: number;
    memory_usage?: number;
    uptime?: number;
  };
}

export const statusService = {
  getStatus: async (): Promise<SystemStatus> => {
    const response = await api.get<SystemStatus>('/api/status');
    return response.data;
  },

  checkApiHealth: async (): Promise<SystemStatus['api_health']> => {
    const response = await api.get<SystemStatus['api_health']>('/api/status/health');
    return response.data;
  },

  getMLServiceStatus: async (): Promise<SystemStatus['ml_services']> => {
    const response = await api.get<SystemStatus['ml_services']>('/api/status/ml');
    return response.data;
  },

  getExternalApiStatus: async (): Promise<SystemStatus['external_apis']> => {
    const response = await api.get<SystemStatus['external_apis']>('/api/status/external');
    return response.data;
  },

  getSystemMetrics: async (): Promise<SystemStatus['system_metrics']> => {
    const response = await api.get<SystemStatus['system_metrics']>('/api/status/metrics');
    return response.data;
  }
};

export const explainService = {
  getShapExplanation: async (data: ShapRequest) => {
    const response = await api.post('/api/explain/shap', data);
    return response.data;
  },

  getPortfolioShapExplanation: async (data: PortfolioShapRequest) => {
    const response = await api.post('/api/explain/portfolio/shap', data);
    return response.data;
  },

  getLimeExplanation: async (data: LimeRequest) => {
    const response = await api.post('/api/explain/lime', data);
    return response.data;
  },

  getWhyAssetExplanation: async (data: WhyAssetRequest) => {
    const response = await api.post('/api/explain/why-asset', data);
    return response.data;
  }
};