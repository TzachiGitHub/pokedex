// Stat colors for Pokemon cards
export const STAT_COLORS = {
  HP: '#FF5252',
  ATTACK: '#FF9800',
  DEFENSE: '#2196F3',
  SPEED: '#4CAF50',
} as const;

// Default values
export const DEFAULT_LOADING_COUNT = 10;
export const DEFAULT_STAT_MAX_VALUE = 255;
export const DEFAULT_STAT_COLOR = '#E53935';

// Storage keys
export const STORAGE_KEYS = {
  THEME_MODE: 'pokedex-theme-mode',
} as const;

// Debounce delays (in milliseconds)
export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
} as const;
