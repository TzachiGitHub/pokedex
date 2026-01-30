import { describe, it, expect } from 'vitest';
import { render, screen } from '../test/test-utils';
import { StatBar } from './StatBar';

describe('StatBar', () => {
  it('renders label and value', () => {
    render(<StatBar label="HP" value={100} />);
    
    expect(screen.getByText('HP')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('renders progress bar', () => {
    render(<StatBar label="Attack" value={75} />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('calculates percentage correctly', () => {
    render(<StatBar label="Defense" value={127} maxValue={255} />);
    
    const progressBar = screen.getByRole('progressbar');
    // 127/255 ≈ 50% (MUI rounds the value)
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
  });

  it('caps percentage at 100', () => {
    render(<StatBar label="Speed" value={300} maxValue={255} />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '100');
  });

  it('uses default max value', () => {
    render(<StatBar label="HP" value={255} />);
    
    const progressBar = screen.getByRole('progressbar');
    // 255/255 = 100%
    expect(progressBar).toHaveAttribute('aria-valuenow', '100');
  });

  it('applies custom color via CSS variable', () => {
    const { container } = render(<StatBar label="HP" value={100} color="#FF5252" />);
    
    const progressBar = container.querySelector('.MuiLinearProgress-root');
    expect(progressBar).toHaveStyle({ '--bar-color': '#FF5252' });
  });
});
