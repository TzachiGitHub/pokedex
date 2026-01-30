# Pokedex Application

A full-stack Pokedex application with a React/TypeScript frontend and Python/Flask backend.

## Features

- **Pokemon List** - Browse 800+ Pokemon with images, stats, and types
- **Pagination** - Configurable page sizes (5, 10, 20) with infinite scroll support
- **Filtering** - Filter by Pokemon type (Fire, Water, Grass, etc.)
- **Fuzzy Search** - Typo-tolerant search across Pokemon names and types
- **Sorting** - Sort by Pokemon number (ascending/descending)
- **Capture System** - Mark Pokemon as captured (persisted in-memory)
- **Dark/Light Mode** - System preference detection with manual toggle
- **URL State** - Filters and pagination persist in URL for bookmarking/sharing

## Tech Stack

### Backend
- Python 3.8+
- Flask 2.0
- Flask-CORS
- In-memory caching with TTL

### Frontend
- React 18
- TypeScript
- Material UI (MUI)
- CSS Modules for component styling
- Vite
- React Router DOM
- Vitest for testing

## Quick Start

### Using Docker (Recommended)

```bash
docker-compose up
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

### Manual Setup

#### Backend

```bash
# Navigate to project root
cd pokedex

# Create virtual environment (optional but recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip3 install -r requirements.txt

# Start the server
python3 app.py
```

The backend will run at http://localhost:8080

#### Frontend

```bash
# Navigate to client directory
cd pokedex/client

# Install dependencies
npm install

# Start dev server
npm run dev
```

The frontend will run at http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pokemon` | List Pokemon with pagination, filtering, sorting |
| GET | `/api/pokemon/types` | Get all unique Pokemon types |
| POST | `/api/pokemon/:number/:name/capture` | Mark Pokemon as captured |
| DELETE | `/api/pokemon/:number/:name/capture` | Release captured Pokemon |
| GET | `/api/captured` | Get list of captured Pokemon |
| GET | `/icon/:number` | Get Pokemon sprite image |

### Query Parameters for `/api/pokemon`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | int | 1 | Page number |
| `limit` | int | 10 | Items per page (5, 10, or 20) |
| `sort` | string | "asc" | Sort order ("asc" or "desc") |
| `type` | string | "" | Filter by Pokemon type |
| `search` | string | "" | Fuzzy search term |

### Example Requests

```bash
# Get first page of Pokemon
curl http://localhost:8080/api/pokemon

# Get Fire type Pokemon, sorted descending
curl "http://localhost:8080/api/pokemon?type=Fire&sort=desc"

# Fuzzy search for "pikachu" (works with typos like "pikacu")
curl "http://localhost:8080/api/pokemon?search=pikacu"

# Capture Pikachu
curl -X POST http://localhost:8080/api/pokemon/25/Pikachu/capture
```

## Testing

### Backend Tests

```bash
cd pokedex
python3 -m pytest -v
```

**Test Coverage:**
- 63 tests covering helpers and API endpoints
- Unit tests for filtering, sorting, pagination, fuzzy matching
- Integration tests for all API endpoints

### Frontend Tests

```bash
cd pokedex/client
npm run test:run    # Run once
npm test            # Watch mode
```

**Test Coverage:**
- 137 tests covering components, hooks, context, and API
- Component tests for PokemonCard, PokemonList, FilterBar, SortToggle, Header, LoadingSpinner, StatBar
- Hook tests for useUrlState, useInfiniteScroll, useFuzzySearch, useDebounce, useScrollRestore
- Context tests for ThemeContext, PokemonContext
- API tests for all endpoints

## Project Structure

```
pokedex/
├── app.py              # Flask application routes
├── helpers.py          # Business logic helpers
├── db.py               # Database abstraction (do not modify)
├── pokemon_db.json     # Pokemon data
├── requirements.txt    # Python dependencies
├── test_app.py         # API integration tests
├── test_helpers.py     # Helper unit tests
├── Dockerfile          # Backend Docker image
├── docker-compose.yml  # Multi-container setup
└── client/
    ├── src/
    │   ├── api/          # API client functions
    │   ├── components/   # React components
    │   │   ├── FilterBar/      # Filter bar sub-components
    │   │   ├── PokemonCard/    # Pokemon card sub-components
    │   │   ├── PokemonListStates/  # List state components
    │   │   └── SortToggle/     # Sort toggle sub-components
    │   ├── constants/    # Shared constants (colors, keys, delays)
    │   ├── context/      # React context providers
    │   ├── hooks/        # Custom React hooks
    │   ├── i18n/         # Internationalization & translations
    │   ├── styles/       # Global CSS styles
    │   ├── test/         # Test utilities
    │   ├── theme/        # MUI theme configuration
    │   └── types/        # TypeScript type definitions
    ├── package.json
    ├── vite.config.ts
    ├── vitest.config.ts
    └── Dockerfile
```

## Environment Variables

### Backend (.env)
```
FLASK_PORT=8080
FLASK_DEBUG=true
CACHE_TTL=60
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8080
```

## Performance Considerations

- **Backend Caching**: Pokemon data is cached in-memory with 60s TTL to avoid repeated 2s database delays
- **Server-side Filtering**: All filtering/sorting happens on the backend to reduce payload size
- **Lazy Loading**: Images load lazily as cards scroll into view
- **Debounced Search**: Search input is debounced to prevent excessive API calls
- **Infinite Scroll**: Optional continuous loading instead of traditional pagination

## License

MIT
