import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#1976d2" },
    secondary: { main: "#26a69a" },
    background: { default: "#121212", paper: "#1e1e1e" },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1e1e1e",
          borderRight: "1px solid rgba(255, 255, 255, 0.12)"
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&.active': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            '& .MuiListItemText-primary': {
              color: '#1976d2'
            }
          }
        }
      }
    }
  }
});