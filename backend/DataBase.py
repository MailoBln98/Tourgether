# database.py

import uuid
from bson.objectid import ObjectId

class UserRepository:
    """Manages user data in the 'users' collection."""
    
    def __init__(self, db, bcrypt):
        """
        Initializes the repository.
        :param db: The PyMongo database instance.
        :param bcrypt: The Flask-Bcrypt instance.
        """
        self.users = db.users
        self.bcrypt = bcrypt

    def create_user(self, name, email, password):
        """Hashes password and saves a new user to the database."""
        hashed_password = self.bcrypt.generate_password_hash(password).decode('utf-8')
        user_uuid = str(uuid.uuid4())
        return self.users.insert_one({
            '_id': user_uuid,
            'name': name,
            'email': email,
            'password': hashed_password
        })

    def find_by_email(self, email):
        """Finds a user by their email address."""
        return self.users.find_one({'email': email})

    def find_by_uuid(self, user_uuid):
        """Finds a user by their unique ID (_id)."""
        return self.users.find_one({'_id': user_uuid})


class GpxRepository:
    """Manages GPX route data in the 'routes' collection."""
    
    def __init__(self, db):
        """
        Initializes the repository.
        :param db: The PyMongo database instance.
        """
        self.routes = db.routes

    def save_gpx(self, gpx_data, owner_uuid):
        """Saves GPX data, associating it with an owner."""
        return self.routes.insert_one({
            'gpx': gpx_data,
            'owner_uuid': owner_uuid,
            'registered_users': []
        })

    def get_all_gpx(self):
        """Retrieves all routes."""
        return list(self.routes.find({}))
    
    def find_by_id(self, route_id):
        """Finds a single route by its ObjectId."""
        try:
            return self.routes.find_one({'_id': ObjectId(route_id)})
        except:
            return None

    def add_user_to_route(self, route_id, user_uuid):
        """Adds a user's UUID to a route's 'registered_users' list."""
        return self.routes.update_one(
            {'_id': ObjectId(route_id)},
            {'$addToSet': {'registered_users': user_uuid}}
        )