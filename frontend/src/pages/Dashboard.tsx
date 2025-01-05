import { Typography, Grid, Paper, Box, CircularProgress, Autocomplete, TextField } from "@mui/material";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { useEffect, useState } from "react";
import { stockService, StockPrediction } from "../services/api";
import DailyData from "../components/DailyData";
import { PieChart, BarChart, LineChart } from "recharts";
import ExplainabilityCharts from "../components/ExplainabilityCharts";
import LiveChart from '../components/LiveChart';
import HistoricalData from '../components/HistoricalData';
import RecommendationList from '../components/RecommendationList';
import RiskCategory from '../components/RiskCategory';
import SimulationSliders from '../components/SimulationSliders';
import SuggestedRebalance from '../components/SuggestedRebalance';
import ExpectedReturns from '../components/ExpectedReturns';
import Heatmap from '../components/Heatmap';
import { exampleSHAP } from '../data/exampleSHAP';
import { newsService } from "../services/newsService";

interface DashboardCard {
  title: string;
  content: React.ReactNode;
}

interface NewsItem {
  title: string;
  link: string;
  published: string;
  sentiment: number;
}

const NewsAndSentiment = ({ ticker }: { ticker: string }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    newsService.getNews(ticker)
      .then((data) => setNews(data))
      .catch((err) => setError("Failed to fetch news."));
  }, [ticker]);

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow text-white">
      <h2 className="text-lg font-bold mb-2">📰 Latest News</h2>
      {news.map((item, index) => (
        <div key={index} className="mb-4">
          <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            {item.title}
          </a>
          <p className="text-sm text-gray-400">Published: {item.published}</p>
          <p className="text-sm">Sentiment: {item.sentiment}</p>
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { ticker } = useAppContext();
  const [stockData, setStockData] = useState<StockPrediction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const data = await stockService.getPrediction(ticker);
        setStockData(data);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [ticker]);

  const cards: DashboardCard[] = [
    {
      title: "Current Stock",
      content: (
        <Box>
          <Typography variant="h3" className="text-white">{ticker}</Typography>
          {stockData && (
            <Typography variant="subtitle1" color="text.secondary">
              Last Price: ${stockData.last_price}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      title: "Prediction",
      content: stockData ? (
        <Box>
          <Typography variant="h6" color={stockData.trend === 'UP' ? 'success.main' : 'error.main'}>
            Trend: {stockData.trend}
          </Typography>
          <Typography variant="body1">
            Next forecast: ${stockData.forecast[0]?.price.toFixed(2)}
          </Typography>
        </Box>
      ) : null,
    },
    {
      title: "Live Data",
      content: <DailyData symbol={ticker} />
    },
    {
      title: "Greeting & Risk Profile",
      content: (
        <Box>
          <Typography variant="h5">Hello, User!</Typography>
          <Typography variant="subtitle1">Risk Profile: Moderate</Typography>
        </Box>
      ),
    },
    {
      title: "System Health",
      content: (
        <Box>
          <Typography variant="body1">Status: Operational</Typography>
          <Typography variant="body1">Latency: 120ms</Typography>
        </Box>
      ),
    },
    {
      title: "Market Overview",
      content: (
        <Box>
          <Typography variant="body1">S&P 500: 4500</Typography>
          <Typography variant="body1">NASDAQ: 15000</Typography>
          <Typography variant="body1">Nifty50: 18000</Typography>
        </Box>
      ),
    },
    {
      title: "Last Sync",
      content: (
        <Box>
          <Typography variant="body1">Last sync: 5 minutes ago</Typography>
          <Typography variant="body1">Refresh status: Up-to-date</Typography>
        </Box>
      ),
    },
    {
      title: "Live Stock Data",
      content: (
        <Box>
          <Typography variant="h5">Search Stocks</Typography>
          <Autocomplete
            options={["AAPL", "TSLA", "MSFT"]}
            renderInput={(params) => <TextField {...params} label="Select Stock" />}
          />
          <Typography variant="h6">Live Charts</Typography>
          <LiveChart symbol={ticker} />
          <Typography variant="h6">Historical Data</Typography>
          <HistoricalData symbol={ticker} />
        </Box>
      ),
    },
    {
      title: "ML-Based Portfolio Recommendation",
      content: (
        <Box>
          <Typography variant="h5">Top 5 Recommended Assets</Typography>
          <RecommendationList />
          <Typography variant="h6">Risk Category</Typography>
          <RiskCategory />
          <Typography variant="h6">Explainability Charts</Typography>
          <ExplainabilityCharts data={exampleSHAP} />
        </Box>
      ),
    },
    {
      title: "Scenario Simulation Panel",
      content: (
        <Box>
          <Typography variant="h5">Market Condition Inputs</Typography>
          <SimulationSliders />
          <Typography variant="h6">Suggested Rebalance</Typography>
          <SuggestedRebalance />
          <Typography variant="h6">Expected Returns</Typography>
          <ExpectedReturns />
        </Box>
      ),
    },
    {
      title: "Portfolio Breakdown",
      content: (
        <Box>
          <Typography variant="h5">Current Asset Allocation</Typography>
          <PieChart />
          <Typography variant="h6">Sector-wise Exposure</Typography>
          <BarChart />
          <Typography variant="h6">Returns Over Time</Typography>
          <LineChart />
          <Typography variant="h6">Asset Correlation</Typography>
          <Heatmap />
        </Box>
      ),
    },
    {
      title: "Quick Actions",
      content: (
        <Box>
          <Typography variant="body1" gutterBottom>
            🔍 View detailed analysis
          </Typography>
          <Typography variant="body1" gutterBottom>
            📊 Update portfolio
          </Typography>
          <Typography variant="body1">
            📰 Check latest news
          </Typography>
        </Box>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome to AlphaInvest AI 👋
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  mb: 2
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {card.title}
                </Typography>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  card.content
                )}
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );
}