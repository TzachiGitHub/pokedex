import { Box } from '@mui/material';
import { useTranslation } from '../../i18n';
import { STAT_COLORS } from '../../constants';
import { StatBar } from '../StatBar';
import styles from '../PokemonCard.module.css';

interface PokemonStatsProps {
  hitPoints: number;
  attack: number;
  defense: number;
  speed: number;
}

export function PokemonStats({ hitPoints, attack, defense, speed }: PokemonStatsProps) {
  const { t } = useTranslation();

  return (
    <Box className={styles.statsContainer}>
      <StatBar label={t('statHp')} value={hitPoints} color={STAT_COLORS.HP} />
      <StatBar label={t('statAttack')} value={attack} color={STAT_COLORS.ATTACK} />
      <StatBar label={t('statDefense')} value={defense} color={STAT_COLORS.DEFENSE} />
      <StatBar label={t('statSpeed')} value={speed} color={STAT_COLORS.SPEED} />
    </Box>
  );
}
