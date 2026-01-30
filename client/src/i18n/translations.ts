export const translations = {
  en: {
    // App
    appTitle: 'Pokédex',

    // Filter Bar
    searchPlaceholder: 'Search Pokemon by name, type, number...',
    typeLabel: 'Type',
    allTypes: 'All Types',
    clearAllFilters: 'Clear all filters',

    // Loading
    loadingPokemon: 'Loading Pokemon...',
    loadingMore: 'Loading more Pokemon...',

    // Pokemon Card
    legendaryPokemon: 'Legendary Pokemon',
    releasePokemon: 'Release Pokemon',
    capturePokemon: 'Capture Pokemon',
    statHp: 'HP',
    statAttack: 'Attack',
    statDefense: 'Defense',
    statSpeed: 'Speed',
    generation: 'Generation {{generation}}',

    // Pokemon List
    errorLoadingPokemon: 'Error loading Pokemon',
    retry: 'Retry',
    noPokemonFound: 'No Pokemon found',
    tryAdjustingFilters: 'Try adjusting your search or filters',
    resetFilters: 'Reset filters',
    seenAllPokemon: "You've seen all {{count}} Pokemon!",
    failedToLoadMore: 'Failed to load more Pokemon. Click retry to try again.',

    // Sort Toggle
    sortByNumber: 'Sort by #:',
    ascending: 'Asc',
    descending: 'Desc',
    show: 'Show',
    showingResults: 'Showing {{shown}} of {{total}} Pokemon',

    // Theme Toggle
    switchToDarkMode: 'Switch to dark mode',
    switchToLightMode: 'Switch to light mode',
    toggleTheme: 'Toggle theme',

    // Errors
    fetchPokemonError: 'Failed to fetch Pokemon',
    usePokemonError: 'usePokemon must be used within a PokemonProvider',
    useThemeError: 'useTheme must be used within a ThemeProvider',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
