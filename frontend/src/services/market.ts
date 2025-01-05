import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function getDaily(symbol: string) {
  const res = await axios.get<{ "Time Series (Daily)": Record<string, any> }>(
    `${API}/api/v1/market/daily`,
    { params: { symbol } }
  );
  return res.data["Time Series (Daily)"];
}

export async function getLiveData(symbol: string) {
  const res = await axios.get(`${API}/api/v1/market/daily`, {
    params: { symbol },
  });
  return res.data;
}