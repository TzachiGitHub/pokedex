import { Box } from '@mui/material';
import styles from '../PokemonCard.module.css';

interface NumberBadgeProps {
  number: number;
}

export function NumberBadge({ number }: NumberBadgeProps) {
  return (
    <Box className={styles.numberBadge}>
      #{number.toString().padStart(3, '0')}
    </Box>
  );
}
