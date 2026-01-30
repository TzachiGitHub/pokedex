import type {
  PokemonListResponse,
  PokemonTypesResponse,
  CapturedResponse,
  PokemonQueryParams
} from '../types/pokemon';

const API_BASE = '/api';

/**
 * Fetch paginated, sorted, and filtered Pokemon list
 */
export async function fetchPokemon(params: Partial<PokemonQueryParams>): Promise<PokemonListResponse> {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) searchParams.set('page', String(params.page));
  if (params.limit !== undefined) searchParams.set('limit', String(params.limit));
  if (params.sort) searchParams.set('sort', params.sort);
  if (params.type) searchParams.set('type', params.type);
  if (params.search) searchParams.set('search', params.search);

  const response = await fetch(`${API_BASE}/pokemon?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch all unique Pokemon types
 */
export async function fetchPokemonTypes(): Promise<PokemonTypesResponse> {
  const response = await fetch(`${API_BASE}/pokemon/types`);

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon types: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Capture a Pokemon
 */
export async function capturePokemon(number: number, name: string): Promise<void> {
  const response = await fetch(`${API_BASE}/pokemon/${number}/${encodeURIComponent(name)}/capture`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`Failed to capture Pokemon: ${response.statusText}`);
  }
}

/**
 * Release a captured Pokemon
 */
export async function releasePokemon(number: number, name: string): Promise<void> {
  const response = await fetch(`${API_BASE}/pokemon/${number}/${encodeURIComponent(name)}/capture`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to release Pokemon: ${response.statusText}`);
  }
}

/**
 * Fetch list of captured Pokemon
 */
export async function fetchCaptured(): Promise<CapturedResponse> {
  const response = await fetch(`${API_BASE}/captured`);

  if (!response.ok) {
    throw new Error(`Failed to fetch captured Pokemon: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get Pokemon icon URL using the Pokemon number
 * Uses PokeAPI sprites which has all Pokemon including newer generations
 */
export function getPokemonIconUrl(number: number): string {
  return `/icon/${number}`;
}
