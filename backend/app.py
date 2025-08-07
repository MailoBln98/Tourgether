from flask import Flask, jsonify, request, Response
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from DataBase import UserRepository, GpxRepository

from typing import Any, Dict, List, Optional
from pymongo.results import InsertOneResult, UpdateResult

# --- App Initialization ---
app: Flask = Flask(__name__)

# --- Configuration ---
app.config["SECRET_KEY"] = "dev-secret-key" # For JWT
app.config["MONGO_URI"] = "mongodb://localhost:27017/tourgether"

# --- Extensions Initialization ---
mongo: PyMongo = PyMongo(app)
bcrypt: Bcrypt = Bcrypt(app)
jwt: JWTManager = JWTManager(app)

# --- Repository Instances ---
# We instantiate our repositories, passing them the necessary dependencies (db connection, bcrypt)
user_repo: UserRepository = UserRepository(db=mongo.db, bcrypt=bcrypt)
gpx_repo: GpxRepository = GpxRepository(db=mongo.db)


# --- Authentication Routes ---

@app.route('/api/auth/register', methods=['POST'])
def register() -> Response:
    """Register a new user.

    Expects JSON with 'name', 'email', and 'password'.
    Returns 201 on success, 400 if data is missing, or 409 if email is already registered.
    """
    data = request.get_json()
    if not data or not 'email' in data or not 'password' in data or not 'name' in data:
        return jsonify({'message': 'Missing name, email, or password'}), 400

    if user_repo.find_by_email(data['email']):
        return jsonify({'message': 'Email already registered'}), 409

    user_repo.create_user(data['name'], data['email'], data['password'])
    return jsonify({'message': 'User created successfully'}), 201


@app.route('/api/auth/login', methods=['POST'])
def login() -> Response:
    """Login a user.

    Expects JSON with 'email' and 'password'.
    Returns 200 with access token on success, 400 if data is missing, or 401 if credentials are invalid.
    """
    data: Any = request.get_json()
    if not data or not 'email' in data or not 'password' in data:
        return jsonify({'message': 'Missing email or password'}), 400

    user: Dict[str, Any] = user_repo.find_by_email(data['email'])

    if user and bcrypt.check_password_hash(user['password'], data['password']):
        access_token: str = create_access_token(identity=user['_id'])
        return jsonify({'access_token': access_token})

    return jsonify({'message': 'Invalid credentials'}), 401


# --- API Routes ---

@app.route('/api/upload_gpx', methods=['POST'])
@jwt_required()
def upload_gpx() -> Response:
    """Upload a GPX route.

    Expects raw GPX data in the request body.
    Returns 201 on success, 400 if no data is provided.
    """
    current_user_uuid: Any = get_jwt_identity()
    gpx_data: str = request.get_data(as_text=True)
    if not gpx_data:
        return jsonify({'message': 'No GPX data provided'}), 400

    result: InsertOneResult = gpx_repo.save_gpx(gpx_data, current_user_uuid)
    return jsonify({'message': 'GPX route uploaded', 'inserted_id': str(result.inserted_id)}), 201


@app.route('/api/routes', methods=['GET'])
def get_routes() -> Response:
    """Get all GPX routes.

    Returns a list of all routes, creator and participants in JSON format.
    """
    routes: List[Dict[str, Any]] = gpx_repo.get_all_gpx()
    for route in routes:
        route['_id'] = str(route['_id'])
    return jsonify(routes)


@app.route('/api/routes/<route_id>/ride', methods=['POST', 'DELETE'])
@jwt_required()
def route_riders(route_id: str) -> Response:
    """Register or unregister a user for a specific route.

    Expects route_id in the URL.
    - POST to register the user for the route.
    - DELETE to unregister the user (not yet implemented).
    Returns 200 on success, 404 if route not found.
    """

    if request.method == 'POST':
        current_user_uuid: Any = get_jwt_identity()

        # Check if route exists first for a better error message
        if not gpx_repo.find_by_id(route_id):
            return jsonify({'message': 'Route not found'}), 404
        
        result: UpdateResult = gpx_repo.add_user_to_route(route_id, current_user_uuid)
        
        if result.modified_count == 0:
            return jsonify({'message': 'User already registered for this route'}), 200

        return jsonify({'message': 'Successfully registered for the route'}), 200
    
    elif request.method == 'DELETE':
        current_user_uuid = get_jwt_identity

        if not gpx_repo.find_by_id(route_id):
            return jsonify({'message': 'Route not found'}), 404
        
        result = gpx_repo.remove_user_from_route(route_id, current_user_uuid)

        if result.modified_count == 0:
            return jsonify({'message': 'User is not registered to this route'}), 200
        
        return jsonify({'message': 'Successfully unregistered from the route'}), 200


if __name__ == '__main__':
    app.run(debug=True)