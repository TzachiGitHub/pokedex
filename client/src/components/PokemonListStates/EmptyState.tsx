import { Box, Typography, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { useTranslation } from '../../i18n';
import styles from '../PokemonList.module.css';

interface EmptyStateProps {
  onReset: () => void;
}

export function EmptyState({ onReset }: EmptyStateProps) {
  const { t } = useTranslation();

  return (
    <Box className={styles.centeredContainer}>
      <SentimentDissatisfiedIcon className={styles.emptyIcon} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {t('noPokemonFound')}
      </Typography>
      <Typography variant="body2" color="text.secondary" className={styles.emptyMessage}>
        {t('tryAdjustingFilters')}
      </Typography>
      <Button variant="outlined" onClick={onReset} startIcon={<RefreshIcon />}>
        {t('resetFilters')}
      </Button>
    </Box>
  );
}
