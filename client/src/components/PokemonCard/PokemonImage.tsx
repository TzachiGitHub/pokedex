import { useState } from 'react';
import { Box, CardMedia, Skeleton } from '@mui/material';
import { getPokemonIconUrl } from '../../api/pokemonApi';
import styles from '../PokemonCard.module.css';

interface PokemonImageProps {
  number: number;
  name: string;
  typeOneColor: string;
  typeTwoColor: string | null;
}

export function PokemonImage({ number, name, typeOneColor, typeTwoColor }: PokemonImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => {
    setImageLoaded(true);
    setImageError(true);
  };

  return (
    <Box
      className={styles.imageContainer}
      style={{
        background: `linear-gradient(135deg, ${typeOneColor}33 0%, ${typeTwoColor || typeOneColor}33 100%)`,
      }}
    >
      {!imageLoaded && (
        <Skeleton
          variant="rectangular"
          width={96}
          height={96}
          className={styles.imageSkeleton}
        />
      )}
      <CardMedia
        component="img"
        image={getPokemonIconUrl(number)}
        alt={name}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
        className={`${styles.pokemonImage} ${imageLoaded ? styles.imageLoaded : styles.imageLoading} ${imageError ? styles.imageError : ''}`}
      />
    </Box>
  );
}
