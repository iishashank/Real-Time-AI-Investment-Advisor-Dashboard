import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Box } from "@mui/material";
import { NavLink } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PsychologyIcon from "@mui/icons-material/Psychology";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";

const pages = [
  { name: "Dashboard", path: "/", icon: DashboardIcon },
  { name: "Risk Profile", path: "/risk", icon: AssessmentIcon },
  { name: "Portfolio", path: "/portfolio", icon: AccountBalanceIcon },
  { name: "Explainability", path: "/explain", icon: PsychologyIcon },
  { name: "Forecast", path: "/forecast", icon: ShowChartIcon },
  { name: "News & Sentiment", path: "/news", icon: NewspaperIcon },
  { name: "System Status", path: "/status", icon: HealthAndSafetyIcon },
];

export default function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" align="center" sx={{ fontWeight: "bold" }}>
          AlphaInvest AI
        </Typography>
      </Box>
      <List>
        {pages.map((page) => {
          const Icon = page.icon;
          return (
            <ListItem
              button
              key={page.name}
              component={NavLink}
              to={page.path}
              sx={{
                "&.active": {
                  backgroundColor: "action.selected",
                },
              }}
            >
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={page.name} />
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}