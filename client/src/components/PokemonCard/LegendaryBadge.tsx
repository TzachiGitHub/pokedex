import { Box, Tooltip } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useTranslation } from '../../i18n';
import styles from '../PokemonCard.module.css';

export function LegendaryBadge() {
  const { t } = useTranslation();

  return (
    <Tooltip title={t('legendaryPokemon')}>
      <Box className={styles.legendaryBadge}>
        <AutoAwesomeIcon className={styles.legendaryIcon} />
      </Box>
    </Tooltip>
  );
}
