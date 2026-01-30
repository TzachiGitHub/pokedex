import { useMemo } from 'react';
import Fuse from 'fuse.js';
import type { Pokemon } from '../types/pokemon';

interface UseFuzzySearchOptions {
  /** Search term */
  searchTerm: string;
  /** Data to search through */
  data: Pokemon[];
  /** Whether to enable fuzzy search (otherwise uses exact match) */
  enabled?: boolean;
}

// Fuse.js configuration for Pokemon search
const FUSE_OPTIONS: Fuse.IFuseOptions<Pokemon> = {
  keys: [
    { name: 'name', weight: 0.4 },
    { name: 'type_one', weight: 0.25 },
    { name: 'type_two', weight: 0.25 },
    { name: 'number', weight: 0.05 },
    { name: 'generation', weight: 0.05 },
  ],
  threshold: 0.4, // Lower = stricter matching
  ignoreLocation: true, // Search anywhere in the string
  includeScore: true,
  minMatchCharLength: 2,
};

/**
 * Hook for client-side fuzzy search across Pokemon data
 * Uses Fuse.js for fuzzy matching across multiple fields
 */
export function useFuzzySearch({
  searchTerm,
  data,
  enabled = true,
}: UseFuzzySearchOptions): Pokemon[] {
  // Create Fuse instance (memoized to avoid recreating on every render)
  const fuse = useMemo(() => new Fuse(data, FUSE_OPTIONS), [data]);

  // Perform search
  const results = useMemo(() => {
    // If search is disabled or empty, return original data
    if (!enabled || !searchTerm.trim()) {
      return data;
    }

    // Perform fuzzy search
    const searchResults = fuse.search(searchTerm.trim());

    // Return just the items (Fuse returns objects with item and score)
    return searchResults.map((result) => result.item);
  }, [fuse, searchTerm, data, enabled]);

  return results;
}
