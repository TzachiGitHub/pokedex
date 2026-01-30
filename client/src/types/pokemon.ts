export interface Pokemon {
  number: number;
  name: string;
  type_one: string;
  type_two: string;
  total: number;
  hit_points: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
  generation: number;
  legendary: boolean;
  captured?: boolean;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PokemonListResponse {
  data: Pokemon[];
  pagination: PaginationInfo;
}

export interface PokemonTypesResponse {
  types: string[];
}

export interface CapturedResponse {
  captured: string[];
}

export interface PokemonQueryParams {
  page: number;
  limit: number;
  sort: 'asc' | 'desc';
  type: string;
  search: string;
}

export type SortOrder = 'asc' | 'desc';

export type PageSize = 5 | 10 | 20;

export const TYPE_COLORS: Record<string, string> = {
  Normal: '#A8A878',
  Fire: '#F08030',
  Water: '#6890F0',
  Electric: '#F8D030',
  Grass: '#78C850',
  Ice: '#98D8D8',
  Fighting: '#C03028',
  Poison: '#A040A0',
  Ground: '#E0C068',
  Flying: '#A890F0',
  Psychic: '#F85888',
  Bug: '#A8B820',
  Rock: '#B8A038',
  Ghost: '#705898',
  Dragon: '#7038F8',
  Dark: '#705848',
  Steel: '#B8B8D0',
  Fairy: '#EE99AC',
};
