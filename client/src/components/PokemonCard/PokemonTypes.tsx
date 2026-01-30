import { Box, Chip } from '@mui/material';
import styles from '../PokemonCard.module.css';

interface PokemonTypesProps {
  typeOne: string;
  typeTwo: string | null;
  typeOneColor: string;
  typeTwoColor: string | null;
}

export function PokemonTypes({ typeOne, typeTwo, typeOneColor, typeTwoColor }: PokemonTypesProps) {
  return (
    <Box className={styles.typesContainer}>
      <Chip
        label={typeOne}
        size="small"
        className={styles.typeChip}
        style={{ backgroundColor: typeOneColor }}
      />
      {typeTwo && (
        <Chip
          label={typeTwo}
          size="small"
          className={styles.typeChip}
          style={{ backgroundColor: typeTwoColor || undefined }}
        />
      )}
    </Box>
  );
}
