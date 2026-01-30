import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import type { SortOrder, PageSize } from '../types/pokemon';

interface UrlState {
  page: number;
  limit: PageSize;
  sort: SortOrder;
  type: string;
  search: string;
}

interface UseUrlStateReturn {
  state: UrlState;
  setPage: (page: number) => void;
  setLimit: (limit: PageSize) => void;
  setSort: (sort: SortOrder) => void;
  setType: (type: string) => void;
  setSearch: (search: string) => void;
  resetFilters: () => void;
}

export const VALID_PAGE_SIZES: readonly PageSize[] = [5, 10, 20] as const;
const VALID_SORT_ORDERS: readonly SortOrder[] = ['asc', 'desc'] as const;

const DEFAULT_STATE: UrlState = {
  page: 1,
  limit: 10,
  sort: 'asc',
  type: '',
  search: '',
};

/**
 * Hook to sync filter/pagination state with URL parameters
 * This ensures users can bookmark and share filtered views,
 * and state persists across browser refreshes.
 */
export function useUrlState(): UseUrlStateReturn {
  const [searchParams, setSearchParams] = useSearchParams();

  const state = useMemo<UrlState>(() => {
    const page = parseInt(searchParams.get('page') || String(DEFAULT_STATE.page), 10);
    const limitParam = parseInt(searchParams.get('limit') || String(DEFAULT_STATE.limit), 10);
    const limit = (VALID_PAGE_SIZES.includes(limitParam as PageSize) ? limitParam : DEFAULT_STATE.limit) as PageSize;
    const sortParam = searchParams.get('sort') as SortOrder | null;
    const sort = sortParam && VALID_SORT_ORDERS.includes(sortParam) ? sortParam : DEFAULT_STATE.sort;
    const type = searchParams.get('type') || DEFAULT_STATE.type;
    const search = searchParams.get('search') || DEFAULT_STATE.search;

    return {
      page: page > 0 ? page : DEFAULT_STATE.page,
      limit,
      sort,
      type,
      search,
    };
  }, [searchParams]);

  const updateParams = useCallback(
    (updates: Partial<UrlState>) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);

        Object.entries(updates).forEach(([key, value]) => {
          if (value === '' || value === DEFAULT_STATE[key as keyof UrlState]) {
            newParams.delete(key);
          } else {
            newParams.set(key, String(value));
          }
        });

        return newParams;
      });
    },
    [setSearchParams]
  );

  const setPage = useCallback(
    (page: number) => updateParams({ page }),
    [updateParams]
  );

  const setLimit = useCallback(
    (limit: PageSize) => updateParams({ limit, page: 1 }), // Reset to page 1 on limit change
    [updateParams]
  );

  const setSort = useCallback(
    (sort: SortOrder) => updateParams({ sort, page: 1 }), // Reset to page 1 on sort change
    [updateParams]
  );

  const setType = useCallback(
    (type: string) => updateParams({ type, page: 1 }), // Reset to page 1 on type change
    [updateParams]
  );

  const setSearch = useCallback(
    (search: string) => updateParams({ search, page: 1 }), // Reset to page 1 on search change
    [updateParams]
  );

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return {
    state,
    setPage,
    setLimit,
    setSort,
    setType,
    setSearch,
    resetFilters,
  };
}
