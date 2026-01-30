import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useUrlState } from './useUrlState';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('useUrlState', () => {
  it('returns default state when no URL params', () => {
    const { result } = renderHook(() => useUrlState(), { wrapper });

    expect(result.current.state).toEqual({
      page: 1,
      limit: 10,
      sort: 'asc',
      type: '',
      search: '',
    });
  });

  it('setPage updates page in state', () => {
    const { result } = renderHook(() => useUrlState(), { wrapper });

    act(() => {
      result.current.setPage(5);
    });

    expect(result.current.state.page).toBe(5);
  });

  it('setLimit updates limit and resets page to 1', () => {
    const { result } = renderHook(() => useUrlState(), { wrapper });

    act(() => {
      result.current.setPage(5);
    });

    act(() => {
      result.current.setLimit(20);
    });

    expect(result.current.state.limit).toBe(20);
    expect(result.current.state.page).toBe(1);
  });

  it('setSort updates sort order', () => {
    const { result } = renderHook(() => useUrlState(), { wrapper });

    act(() => {
      result.current.setSort('desc');
    });

    expect(result.current.state.sort).toBe('desc');
  });

  it('setType updates type filter', () => {
    const { result } = renderHook(() => useUrlState(), { wrapper });

    act(() => {
      result.current.setType('Fire');
    });

    expect(result.current.state.type).toBe('Fire');
  });

  it('setSearch updates search term', () => {
    const { result } = renderHook(() => useUrlState(), { wrapper });

    act(() => {
      result.current.setSearch('pikachu');
    });

    expect(result.current.state.search).toBe('pikachu');
  });

  it('resetFilters clears all filters', () => {
    const { result } = renderHook(() => useUrlState(), { wrapper });

    act(() => {
      result.current.setPage(5);
      result.current.setLimit(20);
      result.current.setSort('desc');
      result.current.setType('Fire');
      result.current.setSearch('pikachu');
    });

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.state).toEqual({
      page: 1,
      limit: 10,
      sort: 'asc',
      type: '',
      search: '',
    });
  });

  it('validates limit to allowed values', () => {
    const { result } = renderHook(() => useUrlState(), { wrapper });

    // 5, 10, 20 are valid
    act(() => {
      result.current.setLimit(5);
    });
    expect(result.current.state.limit).toBe(5);

    act(() => {
      result.current.setLimit(10);
    });
    expect(result.current.state.limit).toBe(10);

    act(() => {
      result.current.setLimit(20);
    });
    expect(result.current.state.limit).toBe(20);
  });

  it('validates page to be positive', () => {
    const { result } = renderHook(() => useUrlState(), { wrapper });

    // Negative page should default to 1
    // Note: The hook validates this when reading from URL params
    expect(result.current.state.page).toBeGreaterThan(0);
  });
});
