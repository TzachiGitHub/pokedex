import { Card, CardContent, Typography } from '@mui/material';
import type { Pokemon } from '../types/pokemon';
import { TYPE_COLORS } from '../types/pokemon';
import { useTranslation } from '../i18n';
import {
  LegendaryBadge,
  NumberBadge,
  PokemonImage,
  PokemonTypes,
  PokemonStats,
  CaptureButton,
} from './PokemonCard/index';
import styles from './PokemonCard.module.css';

interface PokemonCardProps {
  pokemon: Pokemon;
  onToggleCapture: (pokemon: Pokemon) => void;
}

export function PokemonCard({ pokemon, onToggleCapture }: PokemonCardProps) {
  const { t } = useTranslation();

  const typeOneColor = TYPE_COLORS[pokemon.type_one] || '#A8A878';
  const typeTwoColor = pokemon.type_two ? TYPE_COLORS[pokemon.type_two] : null;

  return (
    <Card className={`${styles.card} ${pokemon.captured ? styles.cardCaptured : styles.cardDefault}`}>
      {pokemon.legendary && <LegendaryBadge />}

      <NumberBadge number={pokemon.number} />

      <PokemonImage
        number={pokemon.number}
        name={pokemon.name}
        typeOneColor={typeOneColor}
        typeTwoColor={typeTwoColor}
      />

      <CardContent className={styles.cardContent}>
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          className={styles.pokemonName}
          title={pokemon.name}
        >
          {pokemon.name}
        </Typography>

        <PokemonTypes
          typeOne={pokemon.type_one}
          typeTwo={pokemon.type_two}
          typeOneColor={typeOneColor}
          typeTwoColor={typeTwoColor}
        />

        <PokemonStats
          hitPoints={pokemon.hit_points}
          attack={pokemon.attack}
          defense={pokemon.defense}
          speed={pokemon.speed}
        />

        <Typography
          variant="caption"
          color="text.secondary"
          className={styles.generationText}
        >
          {t('generation', { generation: pokemon.generation })}
        </Typography>
      </CardContent>

      <CaptureButton
        captured={pokemon.captured ?? false}
        onToggle={() => onToggleCapture(pokemon)}
      />
    </Card>
  );
}
