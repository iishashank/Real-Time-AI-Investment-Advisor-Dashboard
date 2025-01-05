import React from "react";

const LiveChart = ({ symbol }: { symbol: string }) => {
  return (
    <div className="p-4 bg-gray-800 text-white rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-2">📈 Live Stock Chart for {symbol}</h2>
      <p>Chart coming soon...</p>
    </div>
  );
};

export default LiveChart;