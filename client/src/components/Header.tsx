import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material';
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon';
import { ThemeToggle } from './ThemeToggle';
import { useTranslation } from '../i18n';
import styles from './Header.module.css';

export function Header() {
  const { t } = useTranslation();

  return (
    <AppBar position="sticky" elevation={0} className={styles.appBar}>
      <Container maxWidth="xl">
        <Toolbar disableGutters className={styles.toolbar}>
          {/* Logo and title */}
          <Box className={styles.logoContainer}>
            <CatchingPokemonIcon className={styles.logoIcon} />
            <Typography
              variant="h5"
              component="h1"
              className={styles.title}
            >
              {t('appTitle')}
            </Typography>
          </Box>

          {/* Theme toggle */}
          <ThemeToggle />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
