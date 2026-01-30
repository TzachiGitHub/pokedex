import { Box, IconButton, Tooltip } from '@mui/material';
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon';
import { useTranslation } from '../../i18n';
import styles from '../PokemonCard.module.css';

interface CaptureButtonProps {
  captured: boolean;
  onToggle: () => void;
}

export function CaptureButton({ captured, onToggle }: CaptureButtonProps) {
  const { t } = useTranslation();

  return (
    <Box className={styles.captureButtonContainer}>
      <Tooltip title={captured ? t('releasePokemon') : t('capturePokemon')}>
        <IconButton
          onClick={onToggle}
          className={`${styles.captureButton} ${captured ? styles.captureButtonActive : styles.captureButtonInactive}`}
        >
          <CatchingPokemonIcon
            className={`${styles.captureIcon} ${captured ? styles.captureIconActive : styles.captureIconInactive}`}
          />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
