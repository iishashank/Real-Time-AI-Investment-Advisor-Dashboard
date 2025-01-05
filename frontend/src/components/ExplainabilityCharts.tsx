import React from 'react';
import Plot from 'react-plotly.js';

interface SHAPData {
  feature: string;
  value: number;
}

interface ExplainabilityChartsProps {
  data: SHAPData[];
}

const ExplainabilityCharts: React.FC<ExplainabilityChartsProps> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  const features = sortedData.map((d) => d.feature);
  const values = sortedData.map((d) => d.value);

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">🔍 SHAP Feature Importance</h2>
      <Plot
        data={[
          {
            x: values,
            y: features,
            type: 'bar',
            orientation: 'h',
            marker: {
              color: values.map((v) => (v > 0 ? 'green' : 'red')),
            },
          },
        ]}
        layout={{
          width: 600,
          height: 400,
          margin: { l: 150, r: 50, t: 30, b: 50 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
          font: { color: 'white' },
        }}
        config={{ responsive: true }}
      />
    </div>
  );
};

export default ExplainabilityCharts;