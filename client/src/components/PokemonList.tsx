import { Grid, Box } from '@mui/material';
import { PokemonCard } from './PokemonCard';
import { LoadingSpinner } from './LoadingSpinner';
import { LoadingGrid } from './LoadingGrid';
import {
  ErrorState,
  EmptyState,
  LoadingOverlay,
  EndOfListMessage,
  InlineError,
} from './PokemonListStates';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useScrollRestore } from '../hooks/useScrollRestore';
import { usePokemon } from '../context/PokemonContext';
import { useTheme } from '../context/ThemeContext';
import { THEME_MODES } from '../theme';
import { useTranslation } from '../i18n';
import styles from './PokemonList.module.css';

export function PokemonList() {
  const { t } = useTranslation();
  const {
    pokemon,
    isLoading,
    isLoadingMore,
    error,
    pagination,
    loadMore,
    toggleCapture,
    refresh,
  } = usePokemon();
  const { mode } = useTheme();
  const isDarkMode = mode === THEME_MODES.DARK;

  // Restore scroll position after page refresh
  useScrollRestore({ isLoading, hasData: pokemon.length > 0 });

  const sentinelRef = useInfiniteScroll({
    hasMore: pagination?.has_next ?? false,
    isLoading: isLoading || isLoadingMore,
    onLoadMore: loadMore,
    rootMargin: '200px',
  });

  // Error state
  if (error && !pokemon.length) {
    return <ErrorState error={error} onRetry={refresh} />;
  }

  // Initial loading state
  if (isLoading && !pokemon.length) {
    return <LoadingGrid count={10} />;
  }

  // Empty state
  if (!pokemon.length && !isLoading) {
    return <EmptyState onReset={refresh} />;
  }

  return (
    <Box className={styles.listContainer}>
      {isLoading && pokemon.length > 0 && <LoadingOverlay isDarkMode={isDarkMode} />}

      <Grid container spacing={3}>
        {pokemon.map((p, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2.4}
            key={`${p.number}-${p.name}-${index}`}
          >
            <PokemonCard pokemon={p} onToggleCapture={toggleCapture} />
          </Grid>
        ))}
      </Grid>

      {isLoadingMore && (
        <Box className={styles.loadingMoreContainer}>
          <LoadingSpinner message={t('loadingMore')} />
        </Box>
      )}

      <Box ref={sentinelRef} className={styles.sentinel} />

      {!pagination?.has_next && pokemon.length > 0 && !isLoading && (
        <EndOfListMessage totalItems={pagination?.total_items ?? 0} />
      )}

      {error && pokemon.length > 0 && <InlineError onRetry={loadMore} />}
    </Box>
  );
}
