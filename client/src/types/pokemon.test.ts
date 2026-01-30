import { describe, it, expect } from 'vitest';
import { TYPE_COLORS } from './pokemon';

describe('TYPE_COLORS', () => {
  it('has color for Fire type', () => {
    expect(TYPE_COLORS.Fire).toBeDefined();
    expect(TYPE_COLORS.Fire).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('has color for Water type', () => {
    expect(TYPE_COLORS.Water).toBeDefined();
    expect(TYPE_COLORS.Water).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('has color for Grass type', () => {
    expect(TYPE_COLORS.Grass).toBeDefined();
    expect(TYPE_COLORS.Grass).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('has color for Electric type', () => {
    expect(TYPE_COLORS.Electric).toBeDefined();
    expect(TYPE_COLORS.Electric).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('has all 18 pokemon types', () => {
    const expectedTypes = [
      'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice',
      'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug',
      'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'
    ];

    expectedTypes.forEach((type) => {
      expect(TYPE_COLORS[type]).toBeDefined();
    });
  });

  it('all colors are valid hex colors', () => {
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

    Object.values(TYPE_COLORS).forEach((color) => {
      expect(color).toMatch(hexColorRegex);
    });
  });
});
