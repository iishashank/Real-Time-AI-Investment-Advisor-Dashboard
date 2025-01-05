import { api } from './api';

export interface PortfolioOptimizationRequest {
  tickers: string[];
  scenario?: 'bull' | 'bear' | 'volatile';
}

export interface PortfolioAllocation {
  ticker: string;
  weight: number;
  expectedReturn: number;
  risk: number;
}

export interface OptimizedPortfolio {
  allocations: PortfolioAllocation[];
  totalExpectedReturn: number;
  totalRisk: number;
  sharpeRatio: number;
}

export const portfolioService = {
  optimizePortfolio: async (request: PortfolioOptimizationRequest): Promise<OptimizedPortfolio> => {
    const response = await api.post<OptimizedPortfolio>('/api/portfolio/optimize', request);
    return response.data;
  },

  getScenarioAnalysis: async (tickers: string[]): Promise<{
    bull: OptimizedPortfolio;
    bear: OptimizedPortfolio;
    volatile: OptimizedPortfolio;
  }> => {
    const response = await api.post('/api/portfolio/scenarios', { tickers });
    return response.data;
  },

  rebalancePortfolio: async (currentAllocation: PortfolioAllocation[]): Promise<OptimizedPortfolio> => {
    const response = await api.post('/api/portfolio/rebalance', { currentAllocation });
    return response.data;
  }
};