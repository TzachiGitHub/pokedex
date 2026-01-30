import type { ThemeOptions } from '@mui/material';

export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export type ThemeMode = (typeof THEME_MODES)[keyof typeof THEME_MODES];

export const DEFAULT_THEME_MODE: ThemeMode = THEME_MODES.LIGHT;

// CSS custom properties for use in CSS modules
export const themeCssVariables = {
  light: {
    '--mui-palette-background-default': '#F5F5F5',
    '--mui-palette-background-paper': '#FFFFFF',
    '--mui-palette-primary-main': '#E53935',
    '--mui-palette-error-main': '#d32f2f',
    '--mui-palette-text-primary': 'rgba(0, 0, 0, 0.87)',
    '--mui-palette-text-secondary': 'rgba(0, 0, 0, 0.6)',
    '--mui-palette-divider': 'rgba(0, 0, 0, 0.12)',
    '--mui-palette-action-hover': 'rgba(0, 0, 0, 0.04)',
  },
  dark: {
    '--mui-palette-background-default': '#121212',
    '--mui-palette-background-paper': '#1E1E1E',
    '--mui-palette-primary-main': '#E53935',
    '--mui-palette-error-main': '#f44336',
    '--mui-palette-text-primary': '#FFFFFF',
    '--mui-palette-text-secondary': 'rgba(255, 255, 255, 0.7)',
    '--mui-palette-divider': 'rgba(255, 255, 255, 0.12)',
    '--mui-palette-action-hover': 'rgba(255, 255, 255, 0.08)',
  },
} as const;

// MUI theme configuration
export const getThemeOptions = (mode: ThemeMode): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: '#E53935', // Pokemon red
      light: '#FF6F60',
      dark: '#AB000D',
    },
    secondary: {
      main: '#1E88E5', // Pokemon blue
      light: '#6AB7FF',
      dark: '#005CB2',
    },
    background: {
      default: mode === THEME_MODES.LIGHT ? '#F5F5F5' : '#121212',
      paper: mode === THEME_MODES.LIGHT ? '#FFFFFF' : '#1E1E1E',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: mode === THEME_MODES.LIGHT
              ? '0 8px 24px rgba(0,0,0,0.15)'
              : '0 8px 24px rgba(0,0,0,0.4)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});
