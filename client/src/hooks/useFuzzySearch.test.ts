import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFuzzySearch } from './useFuzzySearch';
import type { Pokemon } from '../types/pokemon';

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
  },
  {
    number: 25,
    name: 'Pikachu',
    type_one: 'Electric',
    type_two: '',
    total: 320,
    hit_points: 35,
    attack: 55,
    defense: 40,
    special_attack: 50,
    special_defense: 50,
    speed: 90,
    generation: 1,
    legendary: false,
  },
];

describe('useFuzzySearch', () => {
  it('returns all data when search term is empty', () => {
    const { result } = renderHook(() =>
      useFuzzySearch({ searchTerm: '', data: mockPokemon })
    );

    expect(result.current).toHaveLength(3);
  });

  it('filters by exact name match', () => {
    const { result } = renderHook(() =>
      useFuzzySearch({ searchTerm: 'Pikachu', data: mockPokemon })
    );

    expect(result.current).toHaveLength(1);
    expect(result.current[0].name).toBe('Pikachu');
  });

  it('filters by partial name match', () => {
    const { result } = renderHook(() =>
      useFuzzySearch({ searchTerm: 'char', data: mockPokemon })
    );

    expect(result.current).toHaveLength(1);
    expect(result.current[0].name).toBe('Charmander');
  });

  it('performs fuzzy match with typos', () => {
    const { result } = renderHook(() =>
      useFuzzySearch({ searchTerm: 'pikacu', data: mockPokemon })
    );

    // Fuzzy search should find Pikachu despite the typo
    expect(result.current.length).toBeGreaterThanOrEqual(1);
  });

  it('filters by type', () => {
    const { result } = renderHook(() =>
      useFuzzySearch({ searchTerm: 'fire', data: mockPokemon })
    );

    expect(result.current.length).toBeGreaterThanOrEqual(1);
  });

  it('returns empty array when no matches', () => {
    const { result } = renderHook(() =>
      useFuzzySearch({ searchTerm: 'zzzzzzzzz', data: mockPokemon })
    );

    expect(result.current).toHaveLength(0);
  });

  it('returns original data when disabled', () => {
    const { result } = renderHook(() =>
      useFuzzySearch({ searchTerm: 'pikachu', data: mockPokemon, enabled: false })
    );

    expect(result.current).toHaveLength(3);
  });
});
