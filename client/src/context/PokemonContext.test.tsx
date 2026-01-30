import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import { PokemonProvider, usePokemon } from './PokemonContext';
import * as pokemonApi from '../api/pokemonApi';
import type { ReactNode } from 'react';

// Mock the API
vi.mock('../api/pokemonApi', () => ({
  fetchPokemon: vi.fn(),
  fetchPokemonTypes: vi.fn(),
  capturePokemon: vi.fn(),
  releasePokemon: vi.fn(),
}));

const mockFetchPokemon = pokemonApi.fetchPokemon as ReturnType<typeof vi.fn>;
const mockFetchPokemonTypes = pokemonApi.fetchPokemonTypes as ReturnType<typeof vi.fn>;
const mockCapturePokemon = pokemonApi.capturePokemon as ReturnType<typeof vi.fn>;
const mockReleasePokemon = pokemonApi.releasePokemon as ReturnType<typeof vi.fn>;

const mockPokemonResponse = {
  data: [
    {
      number: 1,
      name: 'Bulbasaur',
      type_one: 'Grass',
      type_two: 'Poison',
      hit_points: 45,
      attack: 49,
      defense: 49,
      speed: 45,
      generation: 1,
      legendary: false,
      captured: false,
    },
  ],
  pagination: {
    page: 1,
    limit: 10,
    total_items: 800,
    total_pages: 80,
    has_next: true,
    has_prev: false,
  },
};

const mockTypesResponse = {
  types: ['Fire', 'Water', 'Grass', 'Electric'],
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider>
      <PokemonProvider>{children}</PokemonProvider>
    </ThemeProvider>
  </BrowserRouter>
);

describe('PokemonContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchPokemon.mockResolvedValue(mockPokemonResponse);
    mockFetchPokemonTypes.mockResolvedValue(mockTypesResponse);
    mockCapturePokemon.mockResolvedValue(undefined);
    mockReleasePokemon.mockResolvedValue(undefined);
  });

  it('provides initial loading state', () => {
    const { result } = renderHook(() => usePokemon(), { wrapper });
    
    expect(result.current.isLoading).toBe(true);
  });

  it('fetches pokemon on mount', async () => {
    const { result } = renderHook(() => usePokemon(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(mockFetchPokemon).toHaveBeenCalled();
    expect(result.current.pokemon).toHaveLength(1);
    expect(result.current.pokemon[0].name).toBe('Bulbasaur');
  });

  it('fetches pokemon types on mount', async () => {
    const { result } = renderHook(() => usePokemon(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.types).toHaveLength(4);
    });
    
    expect(mockFetchPokemonTypes).toHaveBeenCalled();
  });

  it('provides pagination info', async () => {
    const { result } = renderHook(() => usePokemon(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.pagination).not.toBeNull();
    });
    
    expect(result.current.pagination?.total_items).toBe(800);
    expect(result.current.pagination?.has_next).toBe(true);
  });

  it('handles fetch error', async () => {
    mockFetchPokemon.mockRejectedValue(new Error('Network error'));
    
    const { result } = renderHook(() => usePokemon(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });
    
    expect(result.current.error).toBe('Network error');
  });

  it('toggles capture status optimistically', async () => {
    const { result } = renderHook(() => usePokemon(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.pokemon).toHaveLength(1);
    });
    
    const pokemon = result.current.pokemon[0];
    expect(pokemon.captured).toBe(false);
    
    await act(async () => {
      await result.current.toggleCapture(pokemon);
    });
    
    // Should be captured now (optimistic update)
    expect(result.current.pokemon[0].captured).toBe(true);
    expect(mockCapturePokemon).toHaveBeenCalledWith(pokemon.number, pokemon.name);
  });

  it('reverts capture on API error', async () => {
    mockCapturePokemon.mockRejectedValue(new Error('API error'));
    
    const { result } = renderHook(() => usePokemon(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.pokemon).toHaveLength(1);
    });
    
    const pokemon = result.current.pokemon[0];
    
    await act(async () => {
      await result.current.toggleCapture(pokemon);
    });
    
    // Should be reverted back to uncaptured
    expect(result.current.pokemon[0].captured).toBe(false);
  });

  it('provides filter state and setters', async () => {
    const { result } = renderHook(() => usePokemon(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.currentPage).toBe(1);
    expect(result.current.pageSize).toBe(10);
    expect(result.current.sortOrder).toBe('asc');
    expect(result.current.typeFilter).toBe('');
    expect(result.current.searchTerm).toBe('');
    
    expect(typeof result.current.setPage).toBe('function');
    expect(typeof result.current.setPageSize).toBe('function');
    expect(typeof result.current.setSortOrder).toBe('function');
    expect(typeof result.current.setTypeFilter).toBe('function');
    expect(typeof result.current.setSearchTerm).toBe('function');
  });
});
