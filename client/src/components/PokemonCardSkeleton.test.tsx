import { describe, it, expect } from 'vitest';
import { render } from '../test/test-utils';
import { PokemonCardSkeleton } from './PokemonCardSkeleton';

describe('PokemonCardSkeleton', () => {
  it('renders skeleton elements', () => {
    render(<PokemonCardSkeleton />);
    
    const skeletons = document.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders rectangular skeleton for image', () => {
    render(<PokemonCardSkeleton />);
    
    const rectangularSkeleton = document.querySelector('.MuiSkeleton-rectangular');
    expect(rectangularSkeleton).toBeInTheDocument();
  });

  it('renders text skeletons for name and stats', () => {
    render(<PokemonCardSkeleton />);
    
    const textSkeletons = document.querySelectorAll('.MuiSkeleton-text');
    expect(textSkeletons.length).toBeGreaterThan(0);
  });

  it('renders rounded skeletons for type badges', () => {
    render(<PokemonCardSkeleton />);
    
    const roundedSkeletons = document.querySelectorAll('.MuiSkeleton-rounded');
    expect(roundedSkeletons).toHaveLength(2); // Two type badges
  });

  it('renders circular skeleton for capture button', () => {
    render(<PokemonCardSkeleton />);
    
    const circularSkeleton = document.querySelector('.MuiSkeleton-circular');
    expect(circularSkeleton).toBeInTheDocument();
  });
});
