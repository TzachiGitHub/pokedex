import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useInfiniteScroll } from './useInfiniteScroll';

describe('useInfiniteScroll', () => {
  it('returns a ref object', () => {
    const { result } = renderHook(() =>
      useInfiniteScroll({
        hasMore: true,
        isLoading: false,
        onLoadMore: vi.fn(),
      })
    );

    expect(result.current).toHaveProperty('current');
  });

  it('initializes with null ref', () => {
    const { result } = renderHook(() =>
      useInfiniteScroll({
        hasMore: true,
        isLoading: false,
        onLoadMore: vi.fn(),
      })
    );

    expect(result.current.current).toBeNull();
  });

  it('accepts custom rootMargin option', () => {
    const { result } = renderHook(() =>
      useInfiniteScroll({
        hasMore: true,
        isLoading: false,
        onLoadMore: vi.fn(),
        rootMargin: '200px',
      })
    );

    expect(result.current).toHaveProperty('current');
  });

  it('accepts custom threshold option', () => {
    const { result } = renderHook(() =>
      useInfiniteScroll({
        hasMore: true,
        isLoading: false,
        onLoadMore: vi.fn(),
        threshold: 0.5,
      })
    );

    expect(result.current).toHaveProperty('current');
  });

  it('does not throw when hasMore is false', () => {
    expect(() => {
      renderHook(() =>
        useInfiniteScroll({
          hasMore: false,
          isLoading: false,
          onLoadMore: vi.fn(),
        })
      );
    }).not.toThrow();
  });

  it('does not throw when isLoading is true', () => {
    expect(() => {
      renderHook(() =>
        useInfiniteScroll({
          hasMore: true,
          isLoading: true,
          onLoadMore: vi.fn(),
        })
      );
    }).not.toThrow();
  });

  it('cleans up on unmount', () => {
    const { unmount } = renderHook(() =>
      useInfiniteScroll({
        hasMore: true,
        isLoading: false,
        onLoadMore: vi.fn(),
      })
    );

    // Should not throw when unmounting
    expect(() => unmount()).not.toThrow();
  });
});
