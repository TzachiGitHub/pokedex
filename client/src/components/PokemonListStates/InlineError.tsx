import { Box, Button, Alert } from '@mui/material';
import { useTranslation } from '../../i18n';
import styles from '../PokemonList.module.css';

interface InlineErrorProps {
  onRetry: () => void;
}

export function InlineError({ onRetry }: InlineErrorProps) {
  const { t } = useTranslation();

  return (
    <Box className={styles.inlineErrorContainer}>
      <Alert
        severity="warning"
        action={
          <Button color="inherit" size="small" onClick={onRetry}>
            {t('retry')}
          </Button>
        }
      >
        {t('failedToLoadMore')}
      </Alert>
    </Box>
  );
}
