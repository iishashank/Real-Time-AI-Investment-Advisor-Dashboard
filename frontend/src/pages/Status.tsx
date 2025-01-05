import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Chip, CircularProgress, Box, Container } from '@mui/material';
import { statusService, SystemStatus } from '../services/api';

// allow numbers or strings in details
type Detail = { label: string; value: string | number };

// your chip colors
type ChipColor = 
  | "success" 
  | "warning" 
  | "error" 
  | "default" 
  | "primary" 
  | "secondary" 
  | "info";

// the card shape
interface StatusCard {
  title:   string;
  status?: string;
  details: Detail[];
  color:   ChipColor;
}

// each item in your grid
interface CardItem {
  key:  string;
  card: StatusCard;
}

export default function Status() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper functions to map status and parse timestamps
  const mapStatus = (status?: string): "error" | "healthy" | "degraded" => {
    if (status === "down") return "error";
    if (status === "error") return "error";
    return (status as "error" | "healthy" | "degraded") || "error";
  };
  const mapAlphaStatus = (status?: string): "error" | "operational" | "limited" => {
    if (status === "down") return "error";
    if (status === "error") return "error";
    return (status as "error" | "operational" | "limited") || "error";
  };
  const parseTimestamp = (value: any): number => {
    if (typeof value === "number") return value;
    if (typeof value === "string" && !isNaN(Number(value))) return Number(value);
    return Date.now();
  };

  const fetchStatus = async () => {
    try {
      const raw = await statusService.getStatus();
      // Log raw API response for debugging
      // eslint-disable-next-line no-console
      console.log('Raw status API response:', raw);
      // Map raw API response to expected SystemStatus shape
      const data: SystemStatus = {
        api_health: {
          status: mapStatus(raw.api_health?.status),
          latency: raw.api_health?.latency ?? 0,
          last_check: parseTimestamp(raw.api_health?.last_check),
        },
        ml_services: {
          model_status: (raw.ml_services?.model_status || "error"),
          model_version: raw.ml_services?.model_version || "",
          last_sync: parseTimestamp(raw.ml_services?.last_sync),
        },
        external_apis: {
          alpha_vantage: {
            status: mapAlphaStatus(raw.external_apis?.alpha_vantage?.status),
            rate_limit_remaining: raw.external_apis?.alpha_vantage?.rate_limit_remaining ?? 0,
            reset_time: parseTimestamp(raw.external_apis?.alpha_vantage?.reset_time),
          }
        },
        system_metrics: raw.system_metrics ? {
          cpu_usage: raw.system_metrics.cpu_usage,
          memory_usage: raw.system_metrics.memory_usage,
          uptime: raw.system_metrics.uptime
        } : undefined
      };
      setStatus(data);
      setError(null);
    } catch (err) {
      console.error("🛑 Fetch error:", err);
      setError((err as Error).message || "Failed to fetch system status");
      // eslint-disable-next-line no-console
      console.error('Error fetching status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  // Build a typed CardItem[] instead of filtering inline
  const items: CardItem[] = [];

  // API Health card
  if (status?.api_health) {
    items.push({
      key: "api_health",
      card: {
        title:   "API Health",
        status:  status.api_health.status,
        details: [
          { label: "Latency", value: `${status.api_health.latency}ms` },
          { label: "Last Check", value: new Date(status.api_health.last_check).toLocaleString() },
        ],
        color: status.api_health.status === "healthy" 
          ? "success" 
          : status.api_health.status === "degraded" 
            ? "warning" 
            : "error",
      },
    });
  }

  // ML Services card
  if (status?.ml_services) {
    items.push({
      key: "ml_services",
      card: {
        title:   "ML Services",
        status:  status.ml_services.model_status,
        details: [
          { label: "Model Version", value: status.ml_services.model_version },
          { label: "Last Sync", value: new Date(status.ml_services.last_sync).toLocaleString() },
        ],
        color: status.ml_services.model_status === "ready" 
          ? "success" 
          : status.ml_services.model_status === "training" 
            ? "warning" 
            : "error",
      },
    });
  }

  // External APIs card (Alpha Vantage)
  if (status?.external_apis?.alpha_vantage) {
    items.push({
      key: "alpha_vantage",
      card: {
        title:   "Alpha Vantage",
        status:  status.external_apis.alpha_vantage.status,
        details: [
          { label: "Rate Limit Remaining", value: status.external_apis.alpha_vantage.rate_limit_remaining },
          { label: "Reset Time", value: new Date(status.external_apis.alpha_vantage.reset_time).toLocaleString() },
        ],
        color: status.external_apis.alpha_vantage.status === "operational" 
          ? "success" 
          : status.external_apis.alpha_vantage.status === "limited" 
            ? "warning" 
            : "error",
      },
    });
  }

  // System Metrics card
  if (status?.system_metrics) {
    items.push({
      key: "system_metrics",
      card: {
        title:   "System Metrics",
        status:  "",
        details: [
          { label: "CPU Usage", value: status.system_metrics.cpu_usage !== undefined ? `${status.system_metrics.cpu_usage}%` : "N/A" },
          { label: "Memory Usage", value: status.system_metrics.memory_usage !== undefined ? `${status.system_metrics.memory_usage}%` : "N/A" },
          { label: "Uptime", value: status.system_metrics.uptime !== undefined ? `${Math.floor(status.system_metrics.uptime/3600)}h ${(Math.floor(status.system_metrics.uptime/60)%60)}m` : "N/A" }
        ],
        color: "info",
      },
    });
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        🔧 System Health
      </Typography>
      <Grid container spacing={3}>
        {items.map(({ key, card }) => (
          <Grid item xs={12} md={4} key={key}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {card.title}
                </Typography>
                {card.status && (
                  <Chip
                    label={card.status}
                    color={card.color}
                    sx={{ mb: 1 }}
                  />
                )}
                {card.details.map((detail, idx) => (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                    key={idx}
                  >
                    {detail.label}: {detail.value ?? "N/A"}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}