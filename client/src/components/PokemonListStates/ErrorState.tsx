import { Box, Button, Alert, AlertTitle } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTranslation } from '../../i18n';
import styles from '../PokemonList.module.css';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const { t } = useTranslation();

  return (
    <Box className={styles.centeredContainer}>
      <Alert
        severity="error"
        className={styles.errorAlert}
        action={
          <Button
            color="inherit"
            size="small"
            onClick={onRetry}
            startIcon={<RefreshIcon />}
          >
            {t('retry')}
          </Button>
        }
      >
        <AlertTitle>{t('errorLoadingPokemon')}</AlertTitle>
        {error}
      </Alert>
    </Box>
  );
}
