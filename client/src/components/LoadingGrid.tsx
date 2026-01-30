import { Grid } from '@mui/material';
import { PokemonCardSkeleton } from './PokemonCardSkeleton';
import { DEFAULT_LOADING_COUNT } from '../constants';

interface LoadingGridProps {
  count?: number;
}

export function LoadingGrid({ count = DEFAULT_LOADING_COUNT }: LoadingGridProps) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={index}>
          <PokemonCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
}
