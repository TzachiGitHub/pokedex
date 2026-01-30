"""
Unit tests for helper functions.
Run with: pytest test_helpers.py -v
"""

import pytest
from helpers import (
    make_pokemon_key,
    make_pokemon_key_from_params,
    fuzzy_match,
    extract_unique_types,
    filter_by_type,
    filter_by_search,
    sort_pokemon,
    paginate,
    add_captured_status,
    set_pokemon_captured,
    get_all_captured,
    captured_pokemon,
)


# =============================================================================
# Test Data
# =============================================================================

SAMPLE_POKEMON = [
    {"number": 1, "name": "Bulbasaur", "type_one": "Grass", "type_two": "Poison", "generation": 1},
    {"number": 4, "name": "Charmander", "type_one": "Fire", "type_two": "", "generation": 1},
    {"number": 7, "name": "Squirtle", "type_one": "Water", "type_two": "", "generation": 1},
    {"number": 25, "name": "Pikachu", "type_one": "Electric", "type_two": "", "generation": 1},
    {"number": 6, "name": "Charizard", "type_one": "Fire", "type_two": "Flying", "generation": 1},
]


# =============================================================================
# Test: Pokemon Key Functions
# =============================================================================

class TestPokemonKey:
    def test_make_pokemon_key(self):
        pokemon = {"number": 25, "name": "Pikachu"}
        assert make_pokemon_key(pokemon) == "25:Pikachu"
    
    def test_make_pokemon_key_from_params(self):
        assert make_pokemon_key_from_params(25, "Pikachu") == "25:Pikachu"
    
    def test_keys_match(self):
        pokemon = {"number": 1, "name": "Bulbasaur"}
        key1 = make_pokemon_key(pokemon)
        key2 = make_pokemon_key_from_params(1, "Bulbasaur")
        assert key1 == key2


# =============================================================================
# Test: Fuzzy Match
# =============================================================================

class TestFuzzyMatch:
    def test_exact_match(self):
        assert fuzzy_match("pikachu", "Pikachu") is True
    
    def test_substring_match(self):
        assert fuzzy_match("pika", "Pikachu") is True
    
    def test_typo_tolerance(self):
        assert fuzzy_match("pikacu", "Pikachu") is True  # Missing 'h'
    
    def test_typo_tolerance_charzard(self):
        assert fuzzy_match("charzard", "Charizard") is True  # Missing 'i'
    
    def test_no_match(self):
        assert fuzzy_match("xyz", "Pikachu") is False
    
    def test_case_insensitive(self):
        assert fuzzy_match("PIKACHU", "pikachu") is True
    
    def test_empty_target(self):
        assert fuzzy_match("test", "") is False


# =============================================================================
# Test: Extract Unique Types
# =============================================================================

class TestExtractUniqueTypes:
    def test_extracts_all_types(self):
        types = extract_unique_types(SAMPLE_POKEMON)
        assert "Grass" in types
        assert "Fire" in types
        assert "Water" in types
        assert "Electric" in types
        assert "Poison" in types
        assert "Flying" in types
    
    def test_types_are_sorted(self):
        types = extract_unique_types(SAMPLE_POKEMON)
        assert types == sorted(types)
    
    def test_no_empty_strings(self):
        types = extract_unique_types(SAMPLE_POKEMON)
        assert "" not in types
    
    def test_no_duplicates(self):
        types = extract_unique_types(SAMPLE_POKEMON)
        assert len(types) == len(set(types))
    
    def test_empty_list(self):
        assert extract_unique_types([]) == []


# =============================================================================
# Test: Filter by Type
# =============================================================================

class TestFilterByType:
    def test_filter_fire_type(self):
        result = filter_by_type(SAMPLE_POKEMON, "Fire")
        assert len(result) == 2  # Charmander and Charizard
        assert all(p["type_one"] == "Fire" or p["type_two"] == "Fire" for p in result)
    
    def test_filter_by_secondary_type(self):
        result = filter_by_type(SAMPLE_POKEMON, "Poison")
        assert len(result) == 1
        assert result[0]["name"] == "Bulbasaur"
    
    def test_filter_case_insensitive(self):
        result = filter_by_type(SAMPLE_POKEMON, "fire")
        assert len(result) == 2
    
    def test_no_filter_returns_all(self):
        result = filter_by_type(SAMPLE_POKEMON, "")
        assert len(result) == len(SAMPLE_POKEMON)
    
    def test_no_match_returns_empty(self):
        result = filter_by_type(SAMPLE_POKEMON, "Dragon")
        assert len(result) == 0


# =============================================================================
# Test: Filter by Search
# =============================================================================

class TestFilterBySearch:
    def test_search_by_name(self):
        result = filter_by_search(SAMPLE_POKEMON, "pika")
        assert len(result) == 1
        assert result[0]["name"] == "Pikachu"
    
    def test_search_by_type(self):
        result = filter_by_search(SAMPLE_POKEMON, "fire")
        assert len(result) == 2
    
    def test_search_by_number(self):
        result = filter_by_search(SAMPLE_POKEMON, "25")
        assert len(result) == 1
        assert result[0]["name"] == "Pikachu"
    
    def test_search_fuzzy(self):
        result = filter_by_search(SAMPLE_POKEMON, "pikacu")  # Typo
        assert len(result) == 1
        assert result[0]["name"] == "Pikachu"
    
    def test_no_search_returns_all(self):
        result = filter_by_search(SAMPLE_POKEMON, "")
        assert len(result) == len(SAMPLE_POKEMON)
    
    def test_no_match_returns_empty(self):
        result = filter_by_search(SAMPLE_POKEMON, "zzzzzzz")
        assert len(result) == 0


# =============================================================================
# Test: Sort Pokemon
# =============================================================================

class TestSortPokemon:
    def test_sort_ascending(self):
        result = sort_pokemon(SAMPLE_POKEMON, "asc")
        numbers = [p["number"] for p in result]
        assert numbers == sorted(numbers)
    
    def test_sort_descending(self):
        result = sort_pokemon(SAMPLE_POKEMON, "desc")
        numbers = [p["number"] for p in result]
        assert numbers == sorted(numbers, reverse=True)
    
    def test_default_is_ascending(self):
        result = sort_pokemon(SAMPLE_POKEMON, "invalid")
        numbers = [p["number"] for p in result]
        assert numbers == sorted(numbers)


# =============================================================================
# Test: Pagination
# =============================================================================

class TestPaginate:
    def test_first_page(self):
        data, pagination = paginate(SAMPLE_POKEMON, page=1, limit=2)
        assert len(data) == 2
        assert pagination["page"] == 1
        assert pagination["has_prev"] is False
        assert pagination["has_next"] is True
    
    def test_middle_page(self):
        data, pagination = paginate(SAMPLE_POKEMON, page=2, limit=2)
        assert len(data) == 2
        assert pagination["page"] == 2
        assert pagination["has_prev"] is True
        assert pagination["has_next"] is True
    
    def test_last_page(self):
        data, pagination = paginate(SAMPLE_POKEMON, page=3, limit=2)
        assert len(data) == 1  # Only 1 item left
        assert pagination["has_next"] is False
        assert pagination["has_prev"] is True
    
    def test_total_items(self):
        _, pagination = paginate(SAMPLE_POKEMON, page=1, limit=2)
        assert pagination["total_items"] == 5
        assert pagination["total_pages"] == 3
    
    def test_page_exceeds_total(self):
        data, pagination = paginate(SAMPLE_POKEMON, page=100, limit=2)
        assert pagination["page"] == 3  # Adjusted to last page
        assert len(data) == 1
    
    def test_empty_list(self):
        data, pagination = paginate([], page=1, limit=10)
        assert len(data) == 0
        assert pagination["total_items"] == 0
        assert pagination["total_pages"] == 0


# =============================================================================
# Test: Capture Status
# =============================================================================

class TestCaptureStatus:
    def setup_method(self):
        """Clear captured pokemon before each test."""
        captured_pokemon.clear()
    
    def test_capture_pokemon(self):
        key = set_pokemon_captured(25, "Pikachu", captured=True)
        assert key == "25:Pikachu"
        assert "25:Pikachu" in captured_pokemon
    
    def test_release_pokemon(self):
        set_pokemon_captured(25, "Pikachu", captured=True)
        set_pokemon_captured(25, "Pikachu", captured=False)
        assert "25:Pikachu" not in captured_pokemon
    
    def test_get_all_captured(self):
        set_pokemon_captured(25, "Pikachu", captured=True)
        set_pokemon_captured(1, "Bulbasaur", captured=True)
        captured = get_all_captured()
        assert len(captured) == 2
        assert "25:Pikachu" in captured
        assert "1:Bulbasaur" in captured
    
    def test_add_captured_status_to_list(self):
        set_pokemon_captured(25, "Pikachu", captured=True)
        result = add_captured_status(SAMPLE_POKEMON)
        
        pikachu = next(p for p in result if p["name"] == "Pikachu")
        bulbasaur = next(p for p in result if p["name"] == "Bulbasaur")
        
        assert pikachu["captured"] is True
        assert bulbasaur["captured"] is False
    
    def test_add_captured_status_doesnt_modify_original(self):
        result = add_captured_status(SAMPLE_POKEMON)
        assert "captured" not in SAMPLE_POKEMON[0]
        assert "captured" in result[0]
