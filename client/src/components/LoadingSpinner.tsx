import { Box, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from '../i18n';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message }: LoadingSpinnerProps) {
  const { t } = useTranslation();
  const displayMessage = message ?? t('loadingPokemon');

  return (
    <Box className={styles.spinnerContainer}>
      <CircularProgress color="primary" size={48} />
      <Typography variant="body1" color="text.secondary" className={styles.message}>
        {displayMessage}
      </Typography>
    </Box>
  );
}
