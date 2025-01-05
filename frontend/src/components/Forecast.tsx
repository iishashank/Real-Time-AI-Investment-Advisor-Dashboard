import React, { useState } from 'react';
import { stockService } from '../services/api';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ForecastData {
  day: number;
  price: number;
  upper: number;
  lower: number;
}

export const Forecast: React.FC = () => {
  const [data, setData] = useState<ForecastData[]>([]);
  const [trend, setTrend] = useState<string>('');
  const [ticker, setTicker] = useState<string>('AAPL');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fetchPrediction = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await stockService.getPrediction(ticker);
      setData(response.forecast);
      setTrend(response.trend);
    } catch (err) {
      setError('Failed to fetch prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-4">
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          className="px-3 py-2 border rounded"
          placeholder="Enter ticker symbol"
        />
        <button
          onClick={fetchPrediction}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Predict'}
        </button>
      </div>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      {trend && (
        <div className="mb-4">
          <span className="font-semibold">Trend: </span>
          <span className={trend === 'UP' ? 'text-green-500' : 'text-red-500'}>
            {trend}
          </span>
        </div>
      )}

      {data.length > 0 && (
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" label={{ value: 'Days', position: 'bottom' }} />
              <YAxis label={{ value: 'Price', angle: -90, position: 'left' }} />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="upper"
                fill="#8884d8"
                stroke="none"
                fillOpacity={0.1}
              />
              <Area
                type="monotone"
                dataKey="lower"
                fill="#8884d8"
                stroke="none"
                fillOpacity={0.1}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};