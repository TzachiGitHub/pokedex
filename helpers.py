"""
Helper functions for the Pokedex API.
Contains all business logic separated from Flask routes.
"""

import db
import time
from typing import Set, List, Dict, Any
from difflib import SequenceMatcher
from flask import request

CACHE_TTL = 60  # seconds
VALID_PAGE_SIZES = [5, 10, 20]
DEFAULT_PAGE_SIZE = 10

# =============================================================================
# In-Memory State
# =============================================================================
_cache: Dict[str, Any] = {"data": None, "timestamp": 0}
captured_pokemon: Set[str] = set()  # Store as "number:name" to handle variants

# =============================================================================
# Utility Functions
# =============================================================================

def make_pokemon_key(pokemon: Dict) -> str:
    """Create a unique key for a Pokemon (handles variants with same number)."""
    return f"{pokemon['number']}:{pokemon['name']}"


def make_pokemon_key_from_params(number: int, name: str) -> str:
    """Create a unique key for a Pokemon from route parameters."""
    return f"{number}:{name}"


def fuzzy_match(search_term: str, target: str, threshold: float = 0.6) -> bool:
    """
    Check if search_term fuzzy matches target.
    Uses SequenceMatcher for typo tolerance.
    threshold: 0.6 means 60% similarity required (allows ~2 typos in a 5-letter word)
    """
    search_term = search_term.lower()
    target = target.lower()
    
    # Exact substring match (fast path)
    if search_term in target:
        return True
    
    # Check if search term is similar to any part of target
    if len(search_term) <= len(target):
        ratio = SequenceMatcher(None, search_term, target[:len(search_term) + 2]).ratio()
        if ratio >= threshold:
            return True
    
    # Full comparison
    ratio = SequenceMatcher(None, search_term, target).ratio()
    return ratio >= threshold


# =============================================================================
# Data Access Functions
# =============================================================================

def get_cached_data() -> List[Dict[str, Any]]:
    """Get Pokemon data with caching to avoid 2s delay on every request."""
    current_time = time.time()
    if _cache["data"] is None or (current_time - _cache["timestamp"]) > CACHE_TTL:
        _cache["data"] = db.get()
        _cache["timestamp"] = current_time
    return _cache["data"]


def extract_unique_types(data: List[Dict]) -> List[str]:
    """Extract and return sorted list of unique Pokemon types."""
    types = set()
    for pokemon in data:
        if pokemon.get('type_one'):
            types.add(pokemon['type_one'])
        if pokemon.get('type_two'):
            types.add(pokemon['type_two'])
    types.discard('')  # Remove empty strings
    return sorted(types)


# =============================================================================
# Query Parameter Parsing
# =============================================================================

def parse_query_params() -> Dict[str, Any]:
    """Parse and validate query parameters from the request."""
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', DEFAULT_PAGE_SIZE, type=int)
    sort_order = request.args.get('sort', 'asc', type=str)
    type_filter = request.args.get('type', '', type=str)
    search_term = request.args.get('search', '', type=str).lower()
    
    # Validate limit - only allow specific values
    if limit not in VALID_PAGE_SIZES:
        limit = DEFAULT_PAGE_SIZE
    
    # Validate page - must be positive
    if page < 1:
        page = 1
    
    return {
        'page': page,
        'limit': limit,
        'sort_order': sort_order,
        'type_filter': type_filter,
        'search_term': search_term,
    }


# =============================================================================
# Filtering Functions
# =============================================================================

def filter_by_type(data: List[Dict], type_filter: str) -> List[Dict]:
    """Filter Pokemon by their type (type_one or type_two)."""
    if not type_filter:
        return data
    
    type_filter_lower = type_filter.lower()
    return [
        p for p in data 
        if p.get('type_one', '').lower() == type_filter_lower 
        or p.get('type_two', '').lower() == type_filter_lower
    ]


def filter_by_search(data: List[Dict], search_term: str) -> List[Dict]:
    """Filter Pokemon by fuzzy search across multiple fields."""
    if not search_term:
        return data
    
    return [
        p for p in data
        if fuzzy_match(search_term, p.get('name', ''))
        or fuzzy_match(search_term, p.get('type_one', ''))
        or fuzzy_match(search_term, p.get('type_two', ''))
        or search_term in str(p.get('number', ''))
        or search_term in str(p.get('generation', ''))
    ]


# =============================================================================
# Sorting & Pagination Functions
# =============================================================================

def sort_pokemon(data: List[Dict], sort_order: str) -> List[Dict]:
    """Sort Pokemon by their number in ascending or descending order."""
    return sorted(
        data, 
        key=lambda x: x.get('number', 0),
        reverse=(sort_order == 'desc')
    )


def paginate(data: List[Dict], page: int, limit: int) -> tuple[List[Dict], Dict]:
    """
    Paginate the data and return the page slice with pagination metadata.
    Returns: (paginated_data, pagination_info)
    """
    total_items = len(data)
    total_pages = (total_items + limit - 1) // limit  # Ceiling division
    
    # Adjust page if it exceeds total pages
    if page > total_pages and total_pages > 0:
        page = total_pages
    
    # Slice data for current page
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    paginated_data = data[start_idx:end_idx]
    
    pagination_info = {
        'page': page,
        'limit': limit,
        'total_items': total_items,
        'total_pages': total_pages,
        'has_next': page < total_pages,
        'has_prev': page > 1,
    }
    
    return paginated_data, pagination_info


# =============================================================================
# Capture Status Functions
# =============================================================================

def add_captured_status(pokemon_list: List[Dict]) -> List[Dict]:
    """Add captured status to each Pokemon based on in-memory storage."""
    return [
        {**pokemon, 'captured': make_pokemon_key(pokemon) in captured_pokemon}
        for pokemon in pokemon_list
    ]


def set_pokemon_captured(number: int, name: str, captured: bool) -> str:
    """Set the captured status of a Pokemon. Returns the pokemon key."""
    key = make_pokemon_key_from_params(number, name)
    if captured:
        captured_pokemon.add(key)
    else:
        captured_pokemon.discard(key)
    return key


def get_all_captured() -> List[str]:
    """Get list of all captured Pokemon keys."""
    return list(captured_pokemon)
