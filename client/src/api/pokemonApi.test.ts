import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchPokemon, fetchPokemonTypes, capturePokemon, releasePokemon, fetchCaptured, getPokemonIconUrl } from './pokemonApi';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('pokemonApi', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('fetchPokemon', () => {
    it('fetches pokemon with default params', async () => {
      const mockResponse = {
        data: [{ number: 1, name: 'Bulbasaur' }],
        pagination: { page: 1, limit: 10, total_items: 800 },
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await fetchPokemon({});

      expect(mockFetch).toHaveBeenCalledWith('/api/pokemon?');
      expect(result).toEqual(mockResponse);
    });

    it('includes all query params', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [], pagination: {} }),
      });

      await fetchPokemon({
        page: 2,
        limit: 20,
        sort: 'desc',
        type: 'Fire',
        search: 'char',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('page=2')
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=20')
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('sort=desc')
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('type=Fire')
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('search=char')
      );
    });

    it('throws error on failed response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
      });

      await expect(fetchPokemon({})).rejects.toThrow('Failed to fetch Pokemon');
    });
  });

  describe('fetchPokemonTypes', () => {
    it('fetches pokemon types', async () => {
      const mockResponse = { types: ['Fire', 'Water', 'Grass'] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await fetchPokemonTypes();

      expect(mockFetch).toHaveBeenCalledWith('/api/pokemon/types');
      expect(result).toEqual(mockResponse);
    });

    it('throws error on failed response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      });

      await expect(fetchPokemonTypes()).rejects.toThrow('Failed to fetch Pokemon types');
    });
  });

  describe('capturePokemon', () => {
    it('sends POST request to capture endpoint', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true });

      await capturePokemon(25, 'Pikachu');

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/pokemon/25/Pikachu/capture',
        { method: 'POST' }
      );
    });

    it('encodes special characters in name', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true });

      await capturePokemon(25, 'Mr. Mime');

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/pokemon/25/Mr.%20Mime/capture',
        { method: 'POST' }
      );
    });

    it('throws error on failed response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request',
      });

      await expect(capturePokemon(25, 'Pikachu')).rejects.toThrow('Failed to capture Pokemon');
    });
  });

  describe('releasePokemon', () => {
    it('sends DELETE request to capture endpoint', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true });

      await releasePokemon(25, 'Pikachu');

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/pokemon/25/Pikachu/capture',
        { method: 'DELETE' }
      );
    });
  });

  describe('fetchCaptured', () => {
    it('fetches captured pokemon list', async () => {
      const mockResponse = { captured: ['25:Pikachu', '1:Bulbasaur'] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await fetchCaptured();

      expect(mockFetch).toHaveBeenCalledWith('/api/captured');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getPokemonIconUrl', () => {
    it('returns correct icon URL for pokemon number', () => {
      expect(getPokemonIconUrl(25)).toBe('/icon/25');
      expect(getPokemonIconUrl(1)).toBe('/icon/1');
      expect(getPokemonIconUrl(721)).toBe('/icon/721');
    });
  });
});
