import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { SortToggle } from './SortToggle';
import * as PokemonContext from '../context/PokemonContext';

// Mock the PokemonContext
vi.mock('../context/PokemonContext', () => ({
  usePokemon: vi.fn(),
}));

const mockUsePokemon = PokemonContext.usePokemon as ReturnType<typeof vi.fn>;

const defaultMockValues = {
  sortOrder: 'asc' as const,
  setSortOrder: vi.fn(),
  pageSize: 10 as const,
  setPageSize: vi.fn(),
  pagination: { page: 1, limit: 10, total_items: 100, total_pages: 10, has_next: true, has_prev: false },
};

const renderSortToggle = (mockValues = {}) => {
  mockUsePokemon.mockReturnValue({ ...defaultMockValues, ...mockValues });
  
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <SortToggle />
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('SortToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sort order toggle buttons', () => {
    renderSortToggle();
    
    expect(screen.getByRole('button', { name: /asc/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /desc/i })).toBeInTheDocument();
  });

  it('renders page size selector', () => {
    renderSortToggle();
    
    expect(screen.getByLabelText(/show/i)).toBeInTheDocument();
  });

  it('renders results counter when pagination exists', () => {
    renderSortToggle();
    
    expect(screen.getByText(/showing 10 of 100 pokemon/i)).toBeInTheDocument();
  });

  it('does not render results counter when no pagination', () => {
    renderSortToggle({ pagination: null });
    
    expect(screen.queryByText(/showing/i)).not.toBeInTheDocument();
  });

  it('calls setSortOrder when sort button clicked', () => {
    const setSortOrder = vi.fn();
    renderSortToggle({ setSortOrder });
    
    fireEvent.click(screen.getByRole('button', { name: /desc/i }));
    
    expect(setSortOrder).toHaveBeenCalledWith('desc');
  });

  it('highlights active sort order', () => {
    renderSortToggle({ sortOrder: 'desc' });
    
    const descButton = screen.getByRole('button', { name: /desc/i });
    expect(descButton).toHaveClass('Mui-selected');
  });
});
