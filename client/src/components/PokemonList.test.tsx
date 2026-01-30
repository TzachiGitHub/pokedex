import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { PokemonList } from './PokemonList';
import * as PokemonContext from '../context/PokemonContext';
import type { Pokemon } from '../types/pokemon';

// Mock the PokemonContext
vi.mock('../context/PokemonContext', () => ({
  usePokemon: vi.fn(),
}));

// Mock useScrollRestore to avoid side effects
vi.mock('../hooks/useScrollRestore', () => ({
  useScrollRestore: vi.fn(),
}));

const mockUsePokemon = PokemonContext.usePokemon as ReturnType<typeof vi.fn>;

const mockPokemon: Pokemon[] = [
  {
    number: 1,
    name: 'Bulbasaur',
    type_one: 'Grass',
    type_two: 'Poison',
    total: 318,
    hit_points: 45,
    attack: 49,
    defense: 49,
    special_attack: 65,
    special_defense: 65,
    speed: 45,
    generation: 1,
    legendary: false,
    captured: false,
  },
  {
    number: 4,
    name: 'Charmander',
    type_one: 'Fire',
    type_two: '',
    total: 309,
    hit_points: 39,
    attack: 52,
    defense: 43,
    special_attack: 60,
    special_defense: 50,
    speed: 65,
    generation: 1,
    legendary: false,
    captured: true,
  },
];

const defaultMockValues = {
  pokemon: mockPokemon,
  isLoading: false,
  isLoadingMore: false,
  error: null,
  pagination: { page: 1, limit: 10, total_items: 100, total_pages: 10, has_next: true, has_prev: false },
  loadMore: vi.fn(),
  toggleCapture: vi.fn(),
  refresh: vi.fn(),
};

const renderPokemonList = (mockValues = {}) => {
  mockUsePokemon.mockReturnValue({ ...defaultMockValues, ...mockValues });
  
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <PokemonList />
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('PokemonList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders pokemon cards when data is available', () => {
    renderPokemonList();
    
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('Charmander')).toBeInTheDocument();
  });

  it('renders loading grid when loading with no data', () => {
    renderPokemonList({ pokemon: [], isLoading: true });
    
    const skeletons = document.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders error state when error with no data', () => {
    renderPokemonList({ pokemon: [], error: 'Network error' });
    
    expect(screen.getByText('Network error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('renders empty state when no pokemon and not loading', () => {
    renderPokemonList({ pokemon: [], isLoading: false });
    
    expect(screen.getByText('No Pokemon found')).toBeInTheDocument();
  });

  it('renders loading overlay when loading with existing data', () => {
    renderPokemonList({ isLoading: true });
    
    // Should still show pokemon cards
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    // And loading overlay
    expect(screen.getByText('Loading Pokemon...')).toBeInTheDocument();
  });

  it('renders loading more spinner when loading more', () => {
    renderPokemonList({ isLoadingMore: true });
    
    expect(screen.getByText('Loading more Pokemon...')).toBeInTheDocument();
  });

  it('renders end of list message when no more pages', () => {
    renderPokemonList({
      pagination: { page: 10, limit: 10, total_items: 100, total_pages: 10, has_next: false, has_prev: true },
    });
    
    expect(screen.getByText(/you've seen all 100 pokemon/i)).toBeInTheDocument();
  });

  it('renders inline error when error with existing data', () => {
    renderPokemonList({ error: 'Load more failed' });
    
    // Should still show pokemon cards
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    // And inline error
    expect(screen.getByText(/failed to load more/i)).toBeInTheDocument();
  });
});
