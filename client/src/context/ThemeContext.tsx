import { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { themeCssVariables, getThemeOptions, THEME_MODES, DEFAULT_THEME_MODE } from '../theme';
import type { ThemeMode } from '../theme';
import { translations } from '../i18n';
import { STORAGE_KEYS } from '../constants';

interface ThemeContextValue {
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Get initial theme mode based on:
 * 1. Saved preference in localStorage
 * 2. System preference via prefers-color-scheme
 * 3. Default to light mode
 */
function getInitialMode(): ThemeMode {
  // Check localStorage first
  const savedMode = localStorage.getItem(STORAGE_KEYS.THEME_MODE);
  if (savedMode === THEME_MODES.LIGHT || savedMode === THEME_MODES.DARK) {
    return savedMode;
  }

  // Check system preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return THEME_MODES.DARK;
    }
  }

  return DEFAULT_THEME_MODE;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(getInitialMode);

  // Inject CSS custom properties for theming
  useEffect(() => {
    const colors = themeCssVariables[mode];
    const root = document.documentElement;
    Object.entries(colors).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }, [mode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't set a preference
      const savedMode = localStorage.getItem(STORAGE_KEYS.THEME_MODE);
      if (!savedMode) {
        setModeState(e.matches ? THEME_MODES.DARK : THEME_MODES.LIGHT);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Save mode to localStorage whenever it changes
  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem(STORAGE_KEYS.THEME_MODE, newMode);
  }, []);

  // Use functional update to avoid stale closure
  const toggleTheme = useCallback(() => {
    setModeState((prevMode) => {
      const newMode = prevMode === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT;
      localStorage.setItem(STORAGE_KEYS.THEME_MODE, newMode);
      return newMode;
    });
  }, []);

  // Create MUI theme based on current mode
  const theme = useMemo(() => createTheme(getThemeOptions(mode)), [mode]);

  const contextValue = useMemo(
    () => ({
      mode,
      toggleTheme,
      setMode,
    }),
    [mode, toggleTheme, setMode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error(translations.en.useThemeError);
  }
  return context;
}
