"""
Integration tests for Flask API endpoints.
Run with: pytest test_app.py -v
"""

import pytest
import json
from app import app
from helpers import captured_pokemon


@pytest.fixture
def client():
    """Create a test client for the Flask app."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


@pytest.fixture(autouse=True)
def clear_captured():
    """Clear captured pokemon before each test."""
    captured_pokemon.clear()
    yield
    captured_pokemon.clear()


# =============================================================================
# Test: GET /api/pokemon
# =============================================================================

class TestGetPokemon:
    def test_returns_pokemon_list(self, client):
        response = client.get('/api/pokemon')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'data' in data
        assert 'pagination' in data
        assert isinstance(data['data'], list)
    
    def test_pagination_defaults(self, client):
        response = client.get('/api/pokemon')
        data = json.loads(response.data)
        assert data['pagination']['page'] == 1
        assert data['pagination']['limit'] == 10
    
    def test_custom_page_size(self, client):
        response = client.get('/api/pokemon?limit=5')
        data = json.loads(response.data)
        assert data['pagination']['limit'] == 5
        assert len(data['data']) == 5
    
    def test_invalid_page_size_uses_default(self, client):
        response = client.get('/api/pokemon?limit=7')
        data = json.loads(response.data)
        assert data['pagination']['limit'] == 10
    
    def test_sort_ascending(self, client):
        response = client.get('/api/pokemon?sort=asc&limit=5')
        data = json.loads(response.data)
        numbers = [p['number'] for p in data['data']]
        assert numbers == sorted(numbers)
    
    def test_sort_descending(self, client):
        response = client.get('/api/pokemon?sort=desc&limit=5')
        data = json.loads(response.data)
        numbers = [p['number'] for p in data['data']]
        assert numbers == sorted(numbers, reverse=True)
    
    def test_filter_by_type(self, client):
        response = client.get('/api/pokemon?type=Fire')
        data = json.loads(response.data)
        for pokemon in data['data']:
            assert pokemon['type_one'] == 'Fire' or pokemon.get('type_two') == 'Fire'
    
    def test_search(self, client):
        response = client.get('/api/pokemon?search=pikachu')
        data = json.loads(response.data)
        assert len(data['data']) >= 1
        assert any('Pikachu' in p['name'] for p in data['data'])
    
    def test_fuzzy_search(self, client):
        response = client.get('/api/pokemon?search=pikacu')  # Typo
        data = json.loads(response.data)
        assert len(data['data']) >= 1
    
    def test_pagination_has_next(self, client):
        response = client.get('/api/pokemon?page=1&limit=5')
        data = json.loads(response.data)
        assert data['pagination']['has_next'] is True
    
    def test_pokemon_has_captured_status(self, client):
        response = client.get('/api/pokemon?limit=1')
        data = json.loads(response.data)
        assert 'captured' in data['data'][0]


# =============================================================================
# Test: GET /api/pokemon/types
# =============================================================================

class TestGetPokemonTypes:
    def test_returns_types_list(self, client):
        response = client.get('/api/pokemon/types')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'types' in data
        assert isinstance(data['types'], list)
    
    def test_types_are_sorted(self, client):
        response = client.get('/api/pokemon/types')
        data = json.loads(response.data)
        assert data['types'] == sorted(data['types'])
    
    def test_common_types_exist(self, client):
        response = client.get('/api/pokemon/types')
        data = json.loads(response.data)
        assert 'Fire' in data['types']
        assert 'Water' in data['types']
        assert 'Grass' in data['types']


# =============================================================================
# Test: POST /api/pokemon/<number>/<name>/capture
# =============================================================================

class TestCapturePokemon:
    def test_capture_pokemon(self, client):
        response = client.post('/api/pokemon/25/Pikachu/capture')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['success'] is True
        assert data['captured'] is True
        assert data['key'] == '25:Pikachu'
    
    def test_captured_pokemon_persists(self, client):
        client.post('/api/pokemon/25/Pikachu/capture')
        response = client.get('/api/captured')
        data = json.loads(response.data)
        assert '25:Pikachu' in data['captured']
    
    def test_captured_shows_in_pokemon_list(self, client):
        client.post('/api/pokemon/1/Bulbasaur/capture')
        response = client.get('/api/pokemon?search=bulbasaur')
        data = json.loads(response.data)
        bulbasaur = next((p for p in data['data'] if p['name'] == 'Bulbasaur'), None)
        assert bulbasaur is not None
        assert bulbasaur['captured'] is True


# =============================================================================
# Test: DELETE /api/pokemon/<number>/<name>/capture
# =============================================================================

class TestReleasePokemon:
    def test_release_pokemon(self, client):
        client.post('/api/pokemon/25/Pikachu/capture')
        response = client.delete('/api/pokemon/25/Pikachu/capture')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['success'] is True
        assert data['captured'] is False
    
    def test_released_pokemon_removed_from_list(self, client):
        client.post('/api/pokemon/25/Pikachu/capture')
        client.delete('/api/pokemon/25/Pikachu/capture')
        response = client.get('/api/captured')
        data = json.loads(response.data)
        assert '25:Pikachu' not in data['captured']


# =============================================================================
# Test: GET /api/captured
# =============================================================================

class TestGetCaptured:
    def test_empty_initially(self, client):
        response = client.get('/api/captured')
        data = json.loads(response.data)
        assert data['captured'] == []
    
    def test_returns_all_captured(self, client):
        client.post('/api/pokemon/25/Pikachu/capture')
        client.post('/api/pokemon/1/Bulbasaur/capture')
        response = client.get('/api/captured')
        data = json.loads(response.data)
        assert len(data['captured']) == 2


# =============================================================================
# Test: GET /icon/<number>
# =============================================================================

class TestGetIcon:
    def test_redirects_to_sprite(self, client):
        response = client.get('/icon/25')
        assert response.status_code == 302  # Redirect
        assert 'pokemon/25.png' in response.location


# =============================================================================
# Test: GET /
# =============================================================================

class TestIndex:
    def test_returns_all_pokemon(self, client):
        response = client.get('/')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert isinstance(data, list)
        assert len(data) > 0
