import { Box, Typography, LinearProgress } from '@mui/material';
import { DEFAULT_STAT_MAX_VALUE, DEFAULT_STAT_COLOR } from '../constants';
import styles from './PokemonCard.module.css';

interface StatBarProps {
  label: string;
  value: number;
  maxValue?: number;
  color?: string;
}

export function StatBar({
  label,
  value,
  maxValue = DEFAULT_STAT_MAX_VALUE,
  color = DEFAULT_STAT_COLOR,
}: StatBarProps) {
  const percentage = (value / maxValue) * 100;

  return (
    <Box className={styles.statBarContainer}>
      <Box className={styles.statBarHeader}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="caption" fontWeight="bold">
          {value}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={Math.min(percentage, 100)}
        className={styles.progressBar}
        style={{ '--bar-color': color } as React.CSSProperties}
        classes={{ bar: styles.progressBarInner }}
      />
    </Box>
  );
}
