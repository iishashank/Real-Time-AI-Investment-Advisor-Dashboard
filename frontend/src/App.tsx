import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, Box, ThemeProvider } from "@mui/material";
import { AppProvider } from "./context/AppContext";
import { darkTheme } from "./theme";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Risk from "./pages/Risk";
import Portfolio from "./pages/Portfolio";
import Explainability from "./pages/Explainability";
import Forecast from "./pages/Forecast";
import News from "./pages/News";
import Status from "./pages/Status";

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <AppProvider>
        <Router>
          <CssBaseline />
          <Box sx={{ display: "flex" }}>
            <Sidebar />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                minHeight: "100vh",
                bgcolor: "background.default"
              }}
            >
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/risk" element={<Risk />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/explain" element={<Explainability />} />
                <Route path="/forecast" element={<Forecast />} />
                <Route path="/news" element={<News />} />
                <Route path="/status" element={<Status />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
