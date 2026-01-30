import React, { createContext, useContext, ReactNode } from 'react';
import type { Pokemon, PaginationInfo, SortOrder, PageSize } from '../types/pokemon';

interface PokemonContextValue {
  pokemon: Pokemon[];
  allPokemonForSearch: Pokemon[];
  types: string[];
  pagination: PaginationInfo | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  currentPage: number;
  pageSize: PageSize;
  sortOrder: SortOrder;
  typeFilter: string;
  searchTerm: string;
  setPage: (page: number) => void;
  setPageSize: (size: PageSize) => void;
  setSortOrder: (order: SortOrder) => void;
  setTypeFilter: (type: string) => void;
  setSearchTerm: (term: string) => void;
  loadMore: () => void;
  toggleCapture: (pokemon: Pokemon) => Promise<void>;
  refresh: () => void;
  resetFilters: () => void;
}

const MockPokemonContext = createContext<PokemonContextValue | undefined>(undefined);

export const defaultMockPokemonContext: PokemonContextValue = {
  pokemon: [],
  allPokemonForSearch: [],
  types: ['Fire', 'Water', 'Grass', 'Electric'],
  pagination: { page: 1, limit: 10, total_items: 100, total_pages: 10, has_next: true, has_prev: false },
  isLoading: false,
  isLoadingMore: false,
  error: null,
  currentPage: 1,
  pageSize: 10,
  sortOrder: 'asc',
  typeFilter: '',
  searchTerm: '',
  setPage: () => {},
  setPageSize: () => {},
  setSortOrder: () => {},
  setTypeFilter: () => {},
  setSearchTerm: () => {},
  loadMore: () => {},
  toggleCapture: async () => {},
  refresh: () => {},
  resetFilters: () => {},
};

interface MockPokemonProviderProps {
  children: ReactNode;
  value?: Partial<PokemonContextValue>;
}

export function MockPokemonProvider({ children, value = {} }: MockPokemonProviderProps) {
  const contextValue = { ...defaultMockPokemonContext, ...value };
  
  return (
    <MockPokemonContext.Provider value={contextValue}>
      {children}
    </MockPokemonContext.Provider>
  );
}

export function useMockPokemon(): PokemonContextValue {
  const context = useContext(MockPokemonContext);
  if (!context) {
    throw new Error('useMockPokemon must be used within MockPokemonProvider');
  }
  return context;
}
