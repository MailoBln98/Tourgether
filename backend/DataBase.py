# database.py

import uuid
from datetime import datetime
from bson.objectid import ObjectId
from bson.objectid import ObjectId
from flask_bcrypt import Bcrypt
from pymongo.database import Database, Collection
from pymongo.results import InsertOneResult, UpdateResult
from typing import Any, Dict, List, Optional

MongoDoc = Dict[str, Any]

class UserRepository:
    """Manages user data in the 'users' collection."""
    
    def __init__(self, db: Database, bcrypt: Bcrypt) -> None:
        """
        Initializes the repository.
        :param db: The PyMongo database instance.
        :param bcrypt: The Flask-Bcrypt instance.
        """
        self.users: Collection = db.users
        self.bcrypt: Bcrypt = bcrypt

    def create_user(self, name: str, email: str, password: str) -> InsertOneResult:
        """Hashes password and saves a new user to the database."""
        hashed_password = self.bcrypt.generate_password_hash(password).decode('utf-8')
        user_uuid = str(uuid.uuid4())
        return self.users.insert_one({
            '_id': user_uuid,
            'name': name,
            'email': email,
            'password': hashed_password
        })

    def find_by_email(self, email) -> Optional[MongoDoc]:
        """Finds a user by their email address."""
        return self.users.find_one({'email': email})

    def find_by_uuid(self, user_uuid) -> Optional[MongoDoc]:
        """Finds a user by their unique ID (_id)."""
        return self.users.find_one({'_id': user_uuid})


class GpxRepository:
    """Manages GPX route data in the 'routes' collection."""
    
    def __init__(self, db: Database) -> None:
        """
        Initializes the repository.
        :param db: The PyMongo database instance.
        """
        self.routes: Collection = db.routes

    def save_gpx(self, gpx_data: str, owner_uuid: str, start_time: datetime, start_point: str) -> InsertOneResult:
        """Saves GPX data with start time and point, associating it with an owner."""
        return self.routes.insert_one({
            'gpx': gpx_data,
            'owner_uuid': owner_uuid,
            'start_time': start_time,
            'start_point': start_point,
            'registered_users': []
        })

    def get_all_gpx(self) -> List[MongoDoc]:
        """Retrieves all routes."""
        return list(self.routes.find({}))
    
    def find_by_id(self, route_id: str) -> Optional[MongoDoc]:
        """Finds a single route by its ObjectId."""
        try:
            return self.routes.find_one({'_id': ObjectId(route_id)})
        except:
            return None

    def add_user_to_route(self, route_id: str, user_uuid: str) -> UpdateResult:
        """Adds a user's UUID to a route's 'registered_users' list."""
        return self.routes.update_one(
            {'_id': ObjectId(route_id)},
            {'$addToSet': {'registered_users': user_uuid}}
        )
    
    def remove_user_from_route(self, route_id: str, user_uuid: str) -> UpdateResult:
        """Removes a user's UUID from a route's 'registered_users' list."""
        return self.routes.update_one(
            {'_id': ObjectId(route_id)},
            {'$pull': {'registered_users': user_uuid}}
        )