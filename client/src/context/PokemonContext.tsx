import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import type { ReactNode } from 'react';
import type { Pokemon, PaginationInfo, SortOrder, PageSize } from '../types/pokemon';
import { fetchPokemon, fetchPokemonTypes, capturePokemon, releasePokemon } from '../api/pokemonApi';
import { useUrlState } from '../hooks/useUrlState';
import { useTranslation, translations } from '../i18n';

interface PokemonContextValue {
  // Data
  pokemon: Pokemon[];
  allPokemonForSearch: Pokemon[]; // All accumulated Pokemon for client-side search
  types: string[];
  pagination: PaginationInfo | null;

  // Loading/Error states
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;

  // Filters
  currentPage: number;
  pageSize: PageSize;
  sortOrder: SortOrder;
  typeFilter: string;
  searchTerm: string;

  // Actions
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

const PokemonContext = createContext<PokemonContextValue | undefined>(undefined);

interface PokemonProviderProps {
  children: ReactNode;
}

export function PokemonProvider({ children }: PokemonProviderProps) {
  const { t } = useTranslation();

  // URL state for persistence
  const {
    state: urlState,
    setPage: setUrlPage,
    setLimit: setUrlLimit,
    setSort: setUrlSort,
    setType: setUrlType,
    setSearch: setUrlSearch,
    resetFilters: resetUrlFilters,
  } = useUrlState();

  // Pokemon data state
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [allPokemonForSearch, setAllPokemonForSearch] = useState<Pokemon[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  // Loading/Error state
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track if we're in infinite scroll mode
  const [isInfiniteMode, setIsInfiniteMode] = useState(true);
  
  // Track if this is the initial mount (use ref to avoid re-renders)
  const isInitialMountRef = useRef(true);
  const previousFiltersRef = useRef({ 
    limit: urlState.limit, 
    sort: urlState.sort, 
    type: urlState.type, 
    search: urlState.search 
  });

  // Fetch Pokemon types on mount
  useEffect(() => {
    fetchPokemonTypes()
      .then((response) => setTypes(response.types))
      .catch((err) => console.error('Failed to fetch types:', err));
  }, []);

  // Fetch a single page of Pokemon data
  const fetchSinglePage = useCallback(
    async (page: number, append: boolean = false) => {
      const response = await fetchPokemon({
        page,
        limit: urlState.limit,
        sort: urlState.sort,
        type: urlState.type,
        search: urlState.search,
      });

      if (append) {
        setPokemon((prev) => [...prev, ...response.data]);
        setAllPokemonForSearch((prev) => [...prev, ...response.data]);
      } else {
        setPokemon(response.data);
        setAllPokemonForSearch(response.data);
      }
      setPagination(response.pagination);
      
      return response;
    },
    [urlState.limit, urlState.sort, urlState.type, urlState.search]
  );

  // Fetch Pokemon data (single page or for loadMore)
  const fetchData = useCallback(
    async (page: number, append: boolean = false) => {
      try {
        if (append) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
          setError(null);
        }

        await fetchSinglePage(page, append);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('fetchPokemonError'));
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [fetchSinglePage, t]
  );

  // Fetch all pages from 1 to targetPage (for restoring scroll position on refresh)
  const fetchAllPagesUpTo = useCallback(
    async (targetPage: number) => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch page 1 first (replaces current data)
        await fetchSinglePage(1, false);

        // Fetch remaining pages sequentially (append mode)
        for (let page = 2; page <= targetPage; page++) {
          await fetchSinglePage(page, true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t('fetchPokemonError'));
      } finally {
        setIsLoading(false);
      }
    },
    [fetchSinglePage, t]
  );

  // Initial fetch - restore scroll position if page > 1
  useEffect(() => {
    const initialPage = urlState.page;
    
    if (initialPage > 1) {
      // User refreshed on page > 1, fetch all pages to restore position
      fetchAllPagesUpTo(initialPage);
    } else {
      // Fresh start, just fetch page 1
      fetchData(1, false);
    }
    
    // Mark initial mount complete after effect runs
    const timer = setTimeout(() => {
      isInitialMountRef.current = false;
    }, 0);
    
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty - only run once on mount

  // Handle filter changes (not page) - reset to page 1
  useEffect(() => {
    const prev = previousFiltersRef.current;
    const filtersChanged = 
      prev.limit !== urlState.limit ||
      prev.sort !== urlState.sort ||
      prev.type !== urlState.type ||
      prev.search !== urlState.search;
    
    if (!isInitialMountRef.current && filtersChanged) {
      setUrlPage(1);
      fetchData(1, false);
    }
    
    // Update previous filters ref
    previousFiltersRef.current = {
      limit: urlState.limit,
      sort: urlState.sort,
      type: urlState.type,
      search: urlState.search,
    };
  }, [urlState.limit, urlState.sort, urlState.type, urlState.search, setUrlPage, fetchData]);

  // Handle page changes for infinite scroll (only after initial mount)
  useEffect(() => {
    if (!isInitialMountRef.current && urlState.page > 1 && isInfiniteMode) {
      fetchData(urlState.page, true);
    }
  }, [urlState.page, isInfiniteMode, fetchData]);

  // Load more for infinite scroll
  const loadMore = useCallback(() => {
    if (pagination?.has_next && !isLoadingMore && !isLoading) {
      setIsInfiniteMode(true);
      setUrlPage(urlState.page + 1);
    }
  }, [pagination, isLoadingMore, isLoading, urlState.page, setUrlPage]);

  // Set page (for manual pagination, disables infinite scroll accumulation)
  const setPage = useCallback(
    (page: number) => {
      setIsInfiniteMode(false);
      setUrlPage(page);
      fetchData(page, false);
    },
    [setUrlPage, fetchData]
  );

  // Toggle Pokemon capture status
  const toggleCapture = useCallback(async (pokemonToCapture: Pokemon) => {
    const wasCapturing = !pokemonToCapture.captured;

    // Optimistic update
    setPokemon((prev) =>
      prev.map((p) =>
        p.number === pokemonToCapture.number && p.name === pokemonToCapture.name
          ? { ...p, captured: wasCapturing }
          : p
      )
    );
    setAllPokemonForSearch((prev) =>
      prev.map((p) =>
        p.number === pokemonToCapture.number && p.name === pokemonToCapture.name
          ? { ...p, captured: wasCapturing }
          : p
      )
    );

    try {
      if (wasCapturing) {
        await capturePokemon(pokemonToCapture.number, pokemonToCapture.name);
      } else {
        await releasePokemon(pokemonToCapture.number, pokemonToCapture.name);
      }
    } catch (err) {
      // Revert on error
      setPokemon((prev) =>
        prev.map((p) =>
          p.number === pokemonToCapture.number && p.name === pokemonToCapture.name
            ? { ...p, captured: !wasCapturing }
            : p
        )
      );
      setAllPokemonForSearch((prev) =>
        prev.map((p) =>
          p.number === pokemonToCapture.number && p.name === pokemonToCapture.name
            ? { ...p, captured: !wasCapturing }
            : p
        )
      );
      console.error('Failed to toggle capture:', err);
    }
  }, []);

  // Refresh data (keeps current page position)
  const refresh = useCallback(() => {
    setIsInfiniteMode(true);
    if (urlState.page > 1) {
      fetchAllPagesUpTo(urlState.page);
    } else {
      fetchData(1, false);
    }
  }, [fetchData, fetchAllPagesUpTo, urlState.page]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setIsInfiniteMode(true);
    resetUrlFilters();
  }, [resetUrlFilters]);

  const contextValue = useMemo<PokemonContextValue>(
    () => ({
      pokemon,
      allPokemonForSearch,
      types,
      pagination,
      isLoading,
      isLoadingMore,
      error,
      currentPage: urlState.page,
      pageSize: urlState.limit,
      sortOrder: urlState.sort,
      typeFilter: urlState.type,
      searchTerm: urlState.search,
      setPage,
      setPageSize: setUrlLimit,
      setSortOrder: setUrlSort,
      setTypeFilter: setUrlType,
      setSearchTerm: setUrlSearch,
      loadMore,
      toggleCapture,
      refresh,
      resetFilters,
    }),
    [
      pokemon,
      allPokemonForSearch,
      types,
      pagination,
      isLoading,
      isLoadingMore,
      error,
      urlState,
      setPage,
      setUrlLimit,
      setUrlSort,
      setUrlType,
      setUrlSearch,
      loadMore,
      toggleCapture,
      refresh,
      resetFilters,
    ]
  );

  return (
    <PokemonContext.Provider value={contextValue}>
      {children}
    </PokemonContext.Provider>
  );
}

export function usePokemon(): PokemonContextValue {
  const context = useContext(PokemonContext);
  if (!context) {
    throw new Error(translations.en.usePokemonError);
  }
  return context;
}
