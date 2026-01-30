import { IconButton, Tooltip } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useTheme } from '../context/ThemeContext';
import { THEME_MODES } from '../theme';
import { useTranslation } from '../i18n';
import styles from './ThemeToggle.module.css';

export function ThemeToggle() {
  const { mode, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <Tooltip title={mode === THEME_MODES.LIGHT ? t('switchToDarkMode') : t('switchToLightMode')}>
      <IconButton
        onClick={toggleTheme}
        aria-label={t('toggleTheme')}
        className={`${styles.toggleButton} ${mode === THEME_MODES.LIGHT ? styles.lightMode : styles.darkMode}`}
      >
        {mode === THEME_MODES.LIGHT ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </Tooltip>
  );
}
