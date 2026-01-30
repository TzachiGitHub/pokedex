import { Box } from '@mui/material';
import { usePokemon } from '../context/PokemonContext';
import { SortOrderToggle, PageSizeSelect, ResultsCounter } from './SortToggle/index';
import styles from './SortToggle.module.css';

export function SortToggle() {
  const { sortOrder, setSortOrder, pageSize, setPageSize, pagination } = usePokemon();

  return (
    <Box className={styles.container}>
      <Box className={styles.leftSection}>
        <SortOrderToggle value={sortOrder} onChange={setSortOrder} />
        <PageSizeSelect value={pageSize} onChange={setPageSize} />
      </Box>

      {pagination && (
        <ResultsCounter
          page={pagination.page}
          limit={pagination.limit}
          totalItems={pagination.total_items}
        />
      )}
    </Box>
  );
}
