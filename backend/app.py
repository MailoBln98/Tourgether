from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager

# Import our repository classes from the new database.py file
from DataBase import UserRepository, GpxRepository

# --- App Initialization ---
app = Flask(__name__)

# --- Configuration ---
app.config["SECRET_KEY"] = "dev-secret-key" # For JWT
app.config["MONGO_URI"] = "mongodb://localhost:27017/tourgether"

# --- Extensions Initialization ---
mongo = PyMongo(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# --- Repository Instances ---
# We instantiate our repositories, passing them the necessary dependencies (db connection, bcrypt)
user_repo = UserRepository(db=mongo.db, bcrypt=bcrypt)
gpx_repo = GpxRepository(db=mongo.db)


# --- Authentication Routes ---

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not 'email' in data or not 'password' in data or not 'name' in data:
        return jsonify({'message': 'Missing name, email, or password'}), 400

    if user_repo.find_by_email(data['email']):
        return jsonify({'message': 'Email already registered'}), 409

    user_repo.create_user(data['name'], data['email'], data['password'])
    return jsonify({'message': 'User created successfully'}), 201


@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not 'email' in data or not 'password' in data:
        return jsonify({'message': 'Missing email or password'}), 400

    user = user_repo.find_by_email(data['email'])

    if user and bcrypt.check_password_hash(user['password'], data['password']):
        access_token = create_access_token(identity=user['_id'])
        return jsonify({'access_token': access_token})

    return jsonify({'message': 'Invalid credentials'}), 401


# --- API Routes ---

@app.route('/api/upload_gpx', methods=['POST'])
@jwt_required()
def upload_gpx():
    current_user_uuid = get_jwt_identity()
    gpx_data = request.get_data(as_text=True)
    if not gpx_data:
        return jsonify({'message': 'No GPX data provided'}), 400

    result = gpx_repo.save_gpx(gpx_data, current_user_uuid)
    return jsonify({'message': 'GPX route uploaded', 'inserted_id': str(result.inserted_id)}), 201


@app.route('/api/routes', methods=['GET'])
def get_routes():
    routes = gpx_repo.get_all_gpx()
    for route in routes:
        route['_id'] = str(route['_id'])
    return jsonify(routes)


@app.route('/api/routes/<route_id>/ride', methods=['POST'])
@jwt_required()
def register_for_route(route_id):
    current_user_uuid = get_jwt_identity()

    # Check if route exists first for a better error message
    if not gpx_repo.find_by_id(route_id):
        return jsonify({'message': 'Route not found'}), 404
    
    result = gpx_repo.add_user_to_route(route_id, current_user_uuid)
    
    if result.modified_count == 0:
        return jsonify({'message': 'User already registered for this route'}), 200

    return jsonify({'message': 'Successfully registered for the route'}), 200


if __name__ == '__main__':
    app.run(debug=True)