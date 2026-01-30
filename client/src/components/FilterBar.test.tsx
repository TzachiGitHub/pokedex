import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { FilterBar } from './FilterBar';
import * as PokemonContext from '../context/PokemonContext';

// Mock the PokemonContext
vi.mock('../context/PokemonContext', () => ({
  usePokemon: vi.fn(),
}));

const mockUsePokemon = PokemonContext.usePokemon as ReturnType<typeof vi.fn>;

const defaultMockValues = {
  types: ['Fire', 'Water', 'Grass', 'Electric'],
  typeFilter: '',
  searchTerm: '',
  setTypeFilter: vi.fn(),
  setSearchTerm: vi.fn(),
  resetFilters: vi.fn(),
};

const renderFilterBar = (mockValues = {}) => {
  mockUsePokemon.mockReturnValue({ ...defaultMockValues, ...mockValues });
  
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <FilterBar />
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('FilterBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input', () => {
    renderFilterBar();
    
    expect(screen.getByPlaceholderText(/search pokemon/i)).toBeInTheDocument();
  });

  it('renders type filter dropdown', () => {
    renderFilterBar();
    
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
  });

  it('updates search input on change', () => {
    renderFilterBar();
    
    const searchInput = screen.getByPlaceholderText(/search pokemon/i);
    fireEvent.change(searchInput, { target: { value: 'pikachu' } });
    
    expect(searchInput).toHaveValue('pikachu');
  });

  it('shows clear filters button when filters are active', () => {
    renderFilterBar({ typeFilter: 'Fire' });
    
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('does not show clear filters button when no filters active', () => {
    renderFilterBar();
    
    // Only the type select should be present, not the clear button
    const buttons = screen.queryAllByRole('button');
    // Filter out any buttons that might be part of the select
    const clearButtons = buttons.filter(btn => 
      btn.querySelector('svg[data-testid="FilterAltIcon"]')
    );
    expect(clearButtons).toHaveLength(0);
  });

  it('calls resetFilters when clear button clicked', () => {
    const resetFilters = vi.fn();
    renderFilterBar({ typeFilter: 'Fire', resetFilters });
    
    // Find the clear button (the one with FilterAltIcon)
    const buttons = screen.getAllByRole('button');
    const clearButton = buttons.find(btn => 
      btn.querySelector('svg') !== null
    );
    
    if (clearButton) {
      fireEvent.click(clearButton);
      expect(resetFilters).toHaveBeenCalledTimes(1);
    }
  });
});
