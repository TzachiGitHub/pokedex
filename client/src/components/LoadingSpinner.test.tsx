import { describe, it, expect } from 'vitest';
import { render, screen } from '../test/test-utils';
import { LoadingSpinner } from './LoadingSpinner';
import { LoadingGrid } from './LoadingGrid';
import { PokemonCardSkeleton } from './PokemonCardSkeleton';

describe('LoadingSpinner', () => {
  it('renders with default message', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Loading Pokemon...')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(<LoadingSpinner message="Please wait..." />);
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('renders loading indicator', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});

describe('PokemonCardSkeleton', () => {
  it('renders skeleton elements', () => {
    render(<PokemonCardSkeleton />);
    // Skeleton elements don't have specific roles, but the component should render
    expect(document.querySelector('.MuiSkeleton-root')).toBeInTheDocument();
  });
});

describe('LoadingGrid', () => {
  it('renders default 10 skeleton cards', () => {
    render(<LoadingGrid />);
    const skeletons = document.querySelectorAll('.MuiGrid-item');
    expect(skeletons).toHaveLength(10);
  });

  it('renders custom number of skeleton cards', () => {
    render(<LoadingGrid count={5} />);
    const skeletons = document.querySelectorAll('.MuiGrid-item');
    expect(skeletons).toHaveLength(5);
  });
});
