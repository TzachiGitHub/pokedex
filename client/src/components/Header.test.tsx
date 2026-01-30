import { describe, it, expect } from 'vitest';
import { render, screen } from '../test/test-utils';
import { Header } from './Header';

describe('Header', () => {
  it('renders app title', () => {
    render(<Header />);
    
    expect(screen.getByRole('heading', { name: /pokédex/i })).toBeInTheDocument();
  });

  it('renders pokeball icon', () => {
    render(<Header />);
    
    // MUI icons have data-testid by default
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('renders theme toggle', () => {
    render(<Header />);
    
    expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument();
  });

  it('renders as sticky app bar', () => {
    render(<Header />);
    
    const appBar = document.querySelector('.MuiAppBar-root');
    expect(appBar).toBeInTheDocument();
    expect(appBar).toHaveClass('MuiAppBar-positionSticky');
  });
});
