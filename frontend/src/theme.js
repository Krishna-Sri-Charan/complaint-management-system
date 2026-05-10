// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1', // Indigo (Modern vibe)
    },
    secondary: {
      main: '#ec4899', // Pink (For accents/urgent alerts)
    },
    background: {
      default: '#f8fafc', // Light grey-blue background
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 12, // More rounded, modern corners
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // No all-caps buttons (looks more modern)
          boxShadow: 'none',
          '&:hover': { boxShadow: '0px 4px 12px rgba(99, 102, 241, 0.2)' },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

export default theme;