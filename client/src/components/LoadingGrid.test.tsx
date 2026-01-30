import { describe, it, expect } from 'vitest';
import { render } from '../test/test-utils';
import { LoadingGrid } from './LoadingGrid';

describe('LoadingGrid', () => {
  it('renders default 10 skeleton cards', () => {
    render(<LoadingGrid />);
    
    const gridItems = document.querySelectorAll('.MuiGrid-item');
    expect(gridItems).toHaveLength(10);
  });

  it('renders custom number of skeleton cards', () => {
    render(<LoadingGrid count={5} />);
    
    const gridItems = document.querySelectorAll('.MuiGrid-item');
    expect(gridItems).toHaveLength(5);
  });

  it('renders skeleton elements inside each card', () => {
    render(<LoadingGrid count={3} />);
    
    const skeletons = document.querySelectorAll('.MuiSkeleton-root');
    // Each PokemonCardSkeleton has multiple skeleton elements
    expect(skeletons.length).toBeGreaterThan(3);
  });

  it('renders grid container', () => {
    render(<LoadingGrid />);
    
    const gridContainer = document.querySelector('.MuiGrid-container');
    expect(gridContainer).toBeInTheDocument();
  });
});
