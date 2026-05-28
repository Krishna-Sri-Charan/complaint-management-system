// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ec4899',
      light: '#f472b6',
      dark: '#db2777',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    background: {
      default: '#f4f7fe',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
      disabled: '#94a3b8',
    },
    divider: '#e2e8f0',
  },

  shape: {
    borderRadius: 12,
  },

  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-1px' },
    h2: { fontWeight: 800, letterSpacing: '-0.5px' },
    h3: { fontWeight: 800, letterSpacing: '-0.5px' },
    h4: { fontWeight: 800, letterSpacing: '-0.3px' },
    h5: { fontWeight: 700, letterSpacing: '-0.2px' },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    body1: { lineHeight: 1.7 },
    body2: { lineHeight: 1.6 },
    button: { fontWeight: 700, letterSpacing: '0' },
    caption: { letterSpacing: '0' },
  },

  shadows: [
    'none',
    '0px 1px 3px rgba(0,0,0,0.04), 0px 1px 2px rgba(0,0,0,0.04)',
    '0px 2px 6px rgba(0,0,0,0.05)',
    '0px 4px 12px rgba(0,0,0,0.06)',
    '0px 4px 20px rgba(0,0,0,0.06)',
    '0px 8px 24px rgba(0,0,0,0.07)',
    '0px 8px 32px rgba(0,0,0,0.08)',
    '0px 12px 40px rgba(0,0,0,0.08)',
    '0px 16px 48px rgba(0,0,0,0.09)',
    '0px 20px 56px rgba(0,0,0,0.1)',
    '0px 24px 64px rgba(0,0,0,0.1)',
    '0px 24px 64px rgba(0,0,0,0.12)',
    '0px 24px 64px rgba(0,0,0,0.14)',
    '0px 24px 64px rgba(0,0,0,0.16)',
    '0px 24px 64px rgba(0,0,0,0.18)',
    '0px 24px 64px rgba(0,0,0,0.2)',
    '0px 24px 64px rgba(0,0,0,0.22)',
    '0px 24px 64px rgba(0,0,0,0.24)',
    '0px 24px 64px rgba(0,0,0,0.26)',
    '0px 24px 64px rgba(0,0,0,0.28)',
    '0px 24px 64px rgba(0,0,0,0.3)',
    '0px 24px 64px rgba(0,0,0,0.32)',
    '0px 24px 64px rgba(0,0,0,0.34)',
    '0px 24px 64px rgba(0,0,0,0.36)',
    '0px 32px 80px rgba(0,0,0,0.4)',
  ],

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          boxShadow: 'none',
          fontWeight: 700,
          borderRadius: '10px',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: 'none',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 6px 20px rgba(99, 102, 241, 0.35)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
            boxShadow: 'none',
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)',
        },
        elevation2: {
          boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.06)',
        },
        elevation3: {
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.08)',
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)',
          border: '1px solid #f1f5f9',
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            transition: 'box-shadow 0.2s ease',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#6366f1',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(99,102,241,0.12)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#6366f1',
              borderWidth: '1.5px',
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#6366f1',
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: '8px',
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '16px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#e2e8f0',
        },
      },
    },

    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 700,
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          transition: 'all 0.15s ease',
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#0f172a',
          borderRadius: '8px',
          fontSize: '0.75rem',
          fontWeight: 600,
          padding: '6px 12px',
        },
        arrow: {
          color: '#0f172a',
        },
      },
    },

    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiAlert-root': {
            borderRadius: '10px',
            fontWeight: 600,
          },
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;