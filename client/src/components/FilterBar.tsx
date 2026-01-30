import { useState, useEffect } from 'react';
import { Box, Paper } from '@mui/material';
import { usePokemon } from '../context/PokemonContext';
import { useDebounce } from '../hooks';
import { DEBOUNCE_DELAYS } from '../constants';
import { SearchField, TypeFilterSelect, ClearFiltersButton } from './FilterBar/index';
import styles from './FilterBar.module.css';

export function FilterBar() {
  const {
    types,
    typeFilter,
    searchTerm,
    setTypeFilter,
    setSearchTerm,
    resetFilters,
  } = usePokemon();

  const [localSearch, setLocalSearch] = useState(searchTerm);
  const debouncedSearch = useDebounce(localSearch, DEBOUNCE_DELAYS.SEARCH);

  // Sync local search with context when it changes externally
  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  // Update context when debounced value changes
  useEffect(() => {
    if (debouncedSearch !== searchTerm) {
      setSearchTerm(debouncedSearch);
    }
  }, [debouncedSearch, searchTerm, setSearchTerm]);

  const handleClearSearch = () => {
    setLocalSearch('');
    setSearchTerm('');
  };

  const hasActiveFilters = typeFilter || searchTerm;

  return (
    <Paper elevation={0} className={styles.paper}>
      <Box className={styles.container}>
        <SearchField
          value={localSearch}
          onChange={setLocalSearch}
          onClear={handleClearSearch}
        />

        <TypeFilterSelect
          value={typeFilter}
          types={types}
          onChange={setTypeFilter}
        />

        {hasActiveFilters && <ClearFiltersButton onClick={resetFilters} />}
      </Box>
    </Paper>
  );
}
