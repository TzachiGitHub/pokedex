import { Box, Typography } from '@mui/material';
import { useTranslation } from '../../i18n';
import styles from '../PokemonList.module.css';

interface EndOfListMessageProps {
  totalItems: number;
}

export function EndOfListMessage({ totalItems }: EndOfListMessageProps) {
  const { t } = useTranslation();

  return (
    <Box className={styles.endOfListContainer}>
      <Typography variant="body2" color="text.secondary">
        {t('seenAllPokemon', { count: totalItems })}
      </Typography>
    </Box>
  );
}
