import React, { useEffect, useState } from "react";
import axios from "axios";
import { getLiveData } from "../services/market";

type DailyData = {
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  date: string;
};

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5004';

const DailyData = ({ symbol = "AAPL" }: { symbol?: string }) => {
  const [data, setData] = useState<DailyData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLiveData(symbol)
      .then((res) => {
        console.log("✅ API Response:", res);
        const ts = res["Time Series (Daily)"];
        if (!ts) throw new Error("Time Series not found");

        const latestDate = Object.keys(ts)[0];
        const latestData = ts[latestDate];
        console.log("📅 Latest Date:", latestDate);
        console.log("📊 Latest Data:", latestData);

        setData({
          date: latestDate,
          open: latestData["1. open"],
          high: latestData["2. high"],
          low: latestData["3. low"],
          close: latestData["4. close"],
          volume: latestData["5. volume"],
        });
      })
      .catch((err) => {
        console.error("❌ Live Data Fetch Error:", err);
        setError("Couldn’t load live data. Check your backend.");
      });
  }, [symbol]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!data) {
    return (
      <div className="bg-gray-800 p-4 text-white">
        <p>⚠️ No live data available</p>
      </div>
    );
  }
  if (!data) return <div className="text-gray-300">Loading live data...</div>;

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow text-white">
      <h2 className="text-lg font-bold mb-2">📈 {symbol} Live Data</h2>
      <p><strong>Date:</strong> {data.date}</p>
      <p><strong>Open:</strong> ${data.open}</p>
      <p><strong>High:</strong> ${data.high}</p>
      <p><strong>Low:</strong> ${data.low}</p>
      <p><strong>Close:</strong> ${data.close}</p>
      <p><strong>Volume:</strong> {data.volume}</p>
    </div>
  );
};

export default DailyData;