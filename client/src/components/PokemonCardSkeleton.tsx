import { Box, Skeleton } from '@mui/material';
import styles from './LoadingSpinner.module.css';

export function PokemonCardSkeleton() {
  return (
    <Box className={styles.skeletonCard}>
      <Skeleton variant="rectangular" height={120} />

      <Box className={styles.skeletonContent}>
        <Skeleton variant="text" width="60%" height={32} />

        <Box className={styles.typesRow}>
          <Skeleton variant="rounded" width={60} height={24} />
          <Skeleton variant="rounded" width={60} height={24} />
        </Box>

        <Skeleton variant="text" width="100%" height={16} className={styles.statLine} />
        <Skeleton variant="text" width="80%" height={16} />
        <Skeleton variant="text" width="90%" height={16} />
        <Skeleton variant="text" width="70%" height={16} />

        <Skeleton variant="text" width="40%" height={16} className={styles.generationLine} />
      </Box>

      <Box className={styles.captureButtonRow}>
        <Skeleton variant="circular" width={40} height={40} />
      </Box>
    </Box>
  );
}
