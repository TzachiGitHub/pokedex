"""
Pokedex API - Flask Application
"""

import os
from flask import Flask, jsonify, redirect
from flask_cors import CORS
from helpers import (
    get_cached_data,
    extract_unique_types,
    parse_query_params,
    filter_by_type,
    filter_by_search,
    sort_pokemon,
    paginate,
    add_captured_status,
    set_pokemon_captured,
    get_all_captured,
)

app = Flask(__name__)
CORS(app)


@app.route('/api/pokemon', methods=['GET'])
def get_pokemon():
    params = parse_query_params()
    data = get_cached_data()
    
    data = filter_by_type(data, params['type_filter'])
    data = filter_by_search(data, params['search_term'])
    data = sort_pokemon(data, params['sort_order'])
    data, pagination = paginate(data, params['page'], params['limit'])
    data = add_captured_status(data)
    
    return jsonify({'data': data, 'pagination': pagination})


@app.route('/api/pokemon/types', methods=['GET'])
def get_pokemon_types():
    types = extract_unique_types(get_cached_data())
    return jsonify({'types': types})


@app.route('/api/pokemon/<int:number>/<name>/capture', methods=['POST'])
def capture_pokemon(number: int, name: str):
    key = set_pokemon_captured(number, name, captured=True)
    return jsonify({'success': True, 'captured': True, 'key': key})


@app.route('/api/pokemon/<int:number>/<name>/capture', methods=['DELETE'])
def release_pokemon(number: int, name: str):
    key = set_pokemon_captured(number, name, captured=False)
    return jsonify({'success': True, 'captured': False, 'key': key})


@app.route('/api/captured', methods=['GET'])
def get_captured():
    return jsonify({'captured': get_all_captured()})


@app.route('/icon/<int:number>')
def get_icon(number: int):
    return redirect(f"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{number}.png")


@app.route('/')
def index():
    return jsonify(get_cached_data())


if __name__ == '__main__':
    port = int(os.environ.get('FLASK_PORT', 8080))
    debug = os.environ.get('FLASK_DEBUG', 'true').lower() == 'true'
    app.run(port=port, debug=debug)
