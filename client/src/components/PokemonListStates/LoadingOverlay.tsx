import { Box, Typography, CircularProgress } from '@mui/material';
import { useTranslation } from '../../i18n';
import styles from '../PokemonList.module.css';

interface LoadingOverlayProps {
  isDarkMode: boolean;
}

export function LoadingOverlay({ isDarkMode }: LoadingOverlayProps) {
  const { t } = useTranslation();

  return (
    <Box className={`${styles.loadingOverlay} ${isDarkMode ? styles.loadingOverlayDark : ''}`}>
      <CircularProgress size={24} />
      <Typography variant="body2" color="text.secondary">
        {t('loadingPokemon')}
      </Typography>
    </Box>
  );
}
