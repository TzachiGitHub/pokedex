import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../test/test-utils';
import { PokemonCard } from './PokemonCard';
import type { Pokemon } from '../types/pokemon';

const mockPokemon: Pokemon = {
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
  captured: false,
};

const mockLegendaryPokemon: Pokemon = {
  ...mockPokemon,
  number: 150,
  name: 'Mewtwo',
  type_one: 'Psychic',
  legendary: true,
};

const mockDualTypePokemon: Pokemon = {
  ...mockPokemon,
  number: 6,
  name: 'Charizard',
  type_one: 'Fire',
  type_two: 'Flying',
};

describe('PokemonCard', () => {
  it('renders pokemon name', () => {
    render(<PokemonCard pokemon={mockPokemon} onToggleCapture={vi.fn()} />);
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
  });

  it('renders pokemon number with leading zeros', () => {
    render(<PokemonCard pokemon={mockPokemon} onToggleCapture={vi.fn()} />);
    expect(screen.getByText('#025')).toBeInTheDocument();
  });

  it('renders primary type', () => {
    render(<PokemonCard pokemon={mockPokemon} onToggleCapture={vi.fn()} />);
    expect(screen.getByText('Electric')).toBeInTheDocument();
  });

  it('renders both types for dual-type pokemon', () => {
    render(<PokemonCard pokemon={mockDualTypePokemon} onToggleCapture={vi.fn()} />);
    expect(screen.getByText('Fire')).toBeInTheDocument();
    expect(screen.getByText('Flying')).toBeInTheDocument();
  });

  it('renders stats', () => {
    render(<PokemonCard pokemon={mockPokemon} onToggleCapture={vi.fn()} />);
    expect(screen.getByText('HP')).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();
    expect(screen.getByText('Attack')).toBeInTheDocument();
    expect(screen.getByText('55')).toBeInTheDocument();
    expect(screen.getByText('Defense')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
    expect(screen.getByText('Speed')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();
  });

  it('renders generation', () => {
    render(<PokemonCard pokemon={mockPokemon} onToggleCapture={vi.fn()} />);
    expect(screen.getByText('Generation 1')).toBeInTheDocument();
  });

  it('renders legendary badge for legendary pokemon', () => {
    render(<PokemonCard pokemon={mockLegendaryPokemon} onToggleCapture={vi.fn()} />);
    expect(screen.getByLabelText('Legendary Pokemon')).toBeInTheDocument();
  });

  it('does not render legendary badge for non-legendary pokemon', () => {
    render(<PokemonCard pokemon={mockPokemon} onToggleCapture={vi.fn()} />);
    expect(screen.queryByLabelText('Legendary Pokemon')).not.toBeInTheDocument();
  });

  it('renders capture button', () => {
    render(<PokemonCard pokemon={mockPokemon} onToggleCapture={vi.fn()} />);
    expect(screen.getByLabelText('Capture Pokemon')).toBeInTheDocument();
  });

  it('renders release button when captured', () => {
    const capturedPokemon = { ...mockPokemon, captured: true };
    render(<PokemonCard pokemon={capturedPokemon} onToggleCapture={vi.fn()} />);
    expect(screen.getByLabelText('Release Pokemon')).toBeInTheDocument();
  });

  it('calls onToggleCapture when capture button clicked', () => {
    const onToggleCapture = vi.fn();
    render(<PokemonCard pokemon={mockPokemon} onToggleCapture={onToggleCapture} />);

    fireEvent.click(screen.getByLabelText('Capture Pokemon'));

    expect(onToggleCapture).toHaveBeenCalledWith(mockPokemon);
  });

  it('renders pokemon image with correct alt text', () => {
    render(<PokemonCard pokemon={mockPokemon} onToggleCapture={vi.fn()} />);
    expect(screen.getByAltText('Pikachu')).toBeInTheDocument();
  });
});
