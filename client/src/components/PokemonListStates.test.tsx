import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../test/test-utils';
import {
  ErrorState,
  EmptyState,
  LoadingOverlay,
  EndOfListMessage,
  InlineError,
} from './PokemonListStates';

describe('ErrorState', () => {
  it('renders error message', () => {
    render(<ErrorState error="Network error" onRetry={() => {}} />);
    
    expect(screen.getByText('Network error')).toBeInTheDocument();
    expect(screen.getByText('Error loading Pokemon')).toBeInTheDocument();
  });

  it('renders retry button', () => {
    render(<ErrorState error="Network error" onRetry={() => {}} />);
    
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('calls onRetry when button clicked', () => {
    const onRetry = vi.fn();
    render(<ErrorState error="Network error" onRetry={onRetry} />);
    
    fireEvent.click(screen.getByRole('button', { name: /retry/i }));
    
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});

describe('EmptyState', () => {
  it('renders no Pokemon found message', () => {
    render(<EmptyState onReset={() => {}} />);
    
    expect(screen.getByText('No Pokemon found')).toBeInTheDocument();
  });

  it('renders reset button', () => {
    render(<EmptyState onReset={() => {}} />);
    
    expect(screen.getByRole('button', { name: /reset filters/i })).toBeInTheDocument();
  });

  it('calls onReset when button clicked', () => {
    const onReset = vi.fn();
    render(<EmptyState onReset={onReset} />);
    
    fireEvent.click(screen.getByRole('button', { name: /reset filters/i }));
    
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});

describe('LoadingOverlay', () => {
  it('renders loading spinner', () => {
    render(<LoadingOverlay isDarkMode={false} />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders loading message', () => {
    render(<LoadingOverlay isDarkMode={false} />);
    
    expect(screen.getByText('Loading Pokemon...')).toBeInTheDocument();
  });
});

describe('EndOfListMessage', () => {
  it('renders end of list message with count', () => {
    render(<EndOfListMessage totalItems={800} />);
    
    expect(screen.getByText(/you've seen all 800 pokemon/i)).toBeInTheDocument();
  });
});

describe('InlineError', () => {
  it('renders error message', () => {
    render(<InlineError onRetry={() => {}} />);
    
    expect(screen.getByText(/failed to load more/i)).toBeInTheDocument();
  });

  it('renders retry button', () => {
    render(<InlineError onRetry={() => {}} />);
    
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('calls onRetry when button clicked', () => {
    const onRetry = vi.fn();
    render(<InlineError onRetry={onRetry} />);
    
    fireEvent.click(screen.getByRole('button', { name: /retry/i }));
    
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
