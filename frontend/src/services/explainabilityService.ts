import { api } from './api';

export interface ShapRequest {
  features: number[];
}

export interface LimeRequest {
  features: number[];
}

export interface WhyAssetRequest {
  features: number[];
  asset_name: string;
}

export interface ShapResponse {
  feature_importance: Record<string, number>;
}

export interface LimeResponse {
  feature_contributions: Array<{
    feature: string;
    contribution: number;
  }>;
}

export interface WhyAssetResponse {
  asset: string;
  reasons: string[];
  contributions: Array<{
    feature: string;
    contribution: number;
  }>;
}

export const getShapExplanation = async (data: ShapRequest): Promise<ShapResponse> => {
  const response = await api.post('/api/explain/shap', data);
  return response.data;
};

export const getLimeExplanation = async (data: LimeRequest): Promise<LimeResponse> => {
  const response = await api.post('/api/explain/lime', data);
  return response.data;
};

export const getWhyAssetExplanation = async (data: WhyAssetRequest): Promise<WhyAssetResponse> => {
  const response = await api.post('/api/explain/why-asset', data);
  return response.data;
};