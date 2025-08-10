from flask import Flask, jsonify, request, Response
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from datetime import datetime
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from flask_cors import CORS
from DataBase import db, UserRepository, GpxRepository

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

# --- CORS ---
CORS(app)  # Erlaubt CORS für alle Domains und alle Routen (kann noch eingeschränkt werden)

# --- Repository Instances ---
# We instantiate our repositories, passing them the necessary dependencies (db connection, bcrypt)
user_repo = UserRepository(db, bcrypt)
gpx_repo = GpxRepository(db)


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

@app.route('/api/auth/verify/<token>', methods=['POST'])
def verify_user(token: str) -> Response:
    """Verify a user's email address using a token."""
    
    user: Dict[str, Any] = user_repo.find_by_verification_token(token)

    if user:
        user_repo.verify_user(user['_id'], token)
        return jsonify({'message': 'Email verified successfully'}), 200

    return jsonify({'message': 'Invalid or expired token'}), 400

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

    if user:
        if user.get('is_verified') is False:
            return jsonify({'message': 'Email not verified'}), 401

    if user and bcrypt.check_password_hash(user['password'], data['password']):
        access_token: str = create_access_token(identity=user['_id'])
        return jsonify({'access_token': access_token}), 200

    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/users/batch', methods=['POST'])
def get_users_batch() -> Response:
    """Get multiple users by their UUIDs."""
    try:
        data = request.get_json()
        user_ids = data.get('user_ids', [])
        
        if not user_ids or not isinstance(user_ids, list):
            return jsonify({'message': 'user_ids array required'}), 400
        
        users = user_repo.find_multiple_by_uuids(user_ids)
        
        # Convert to dict for easier frontend access
        user_dict = {user['_id']: user['name'] for user in users}
        
        return jsonify(user_dict), 200
        
    except Exception as e:
        return jsonify({'message': 'Server error'}), 500


# --- API Routes ---

@app.route('/api/upload_gpx', methods=['POST'])
@jwt_required()
def upload_gpx() -> Response:
    """Upload a GPX route with a start time and start point.

    Expects a multipart/form-data request with the following fields:
    - 'gpx_file': The GPX file itself.
    - 'route_name': The name of the route.
    - 'start_time': The start date and time in ISO 8601 format (e.g., "2023-10-27T10:00:00Z").
    - 'start_point': A string describing the starting location as coordinates (e.g., "52.45693768689539, 13.526196936079945").

    Returns 201 on success, 400 if data is missing or invalid.
    """
    current_user_uuid: Any = get_jwt_identity()

    gpx_file = request.files.get('gpx_file')
    route_name = request.form.get('name') 
    start_time_str = request.form.get('start_time')
    start_point = request.form.get('start_point')

    if not gpx_file:
        return jsonify({'message': "Missing 'gpx_file' in the request"}), 400
    if not route_name:
        return jsonify({'message': "Missing 'name' field in the request"}), 400
    if not start_time_str:
        return jsonify({'message': "Missing 'start_time' field in the request"}), 400
    if not start_point:
        return jsonify({'message': "Missing 'start_point' field in the request"}), 400

    gpx_data: str = gpx_file.read().decode('utf-8')
    
    try:
        start_time_dt = datetime.fromisoformat(start_time_str.replace('Z', '+00:00'))
    except ValueError:
        return jsonify({'message': 'Invalid start_time format. Use ISO 8601 format (e.g., 2023-10-27T10:00:00Z).'}), 400
    
    owner = user_repo.find_by_uuid(current_user_uuid)
    owner_name = owner['name'] if owner else 'Unknown'

    result: InsertOneResult = gpx_repo.save_gpx(
        gpx_data=gpx_data,
        owner_uuid=current_user_uuid,
        owner_name=owner_name,
        name=route_name,
        start_time=start_time_dt,
        start_point=start_point
    )
    
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
    Returns 200 on success, 204 if the user was not registered, 404 if route not found.
    """
    current_user_uuid: Any = get_jwt_identity()


    if request.method == 'POST':

        # Check if route exists first for a better error message
        if not gpx_repo.find_by_id(route_id):
            return jsonify({'message': 'Route not found'}), 404
        
        result: UpdateResult = gpx_repo.add_user_to_route(route_id, current_user_uuid)
        
        if result.modified_count == 0:
            return jsonify({'message': 'User already registered for this route'}), 200

        return jsonify({'message': 'Successfully registered for the route'}), 200
    
    elif request.method == 'DELETE':
        

        if not gpx_repo.find_by_id(route_id):
            return jsonify({'message': 'Route not found'}), 404
        
        result = gpx_repo.remove_user_from_route(route_id, current_user_uuid)

        if result.modified_count == 0:
            return jsonify({'message': 'User is not registered to this route'}), 204
        
        return jsonify({'message': 'Successfully unregistered from the route'}), 200


if __name__ == '__main__':
    app.run(debug=True)
