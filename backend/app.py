from flask import Flask, jsonify, request
from flask_pymongo import PyMongo


app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/tourgether"
mongo = PyMongo(app)


class GpxRepository:
    def __init__(self, db):
        self.routes = db.routes

    def save_gpx(self, gpx_data):
        return self.routes.insert_one({'gpx': gpx_data})

    def get_all_gpx(self):
        return list(self.routes.find({}, {'gpx': 1}))


gpx_repo = GpxRepository(mongo.db)


@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({'message': 'Hello, world!'})

@app.route('/api/upload_gpx', methods=['POST'])
def upload_gpx():
    gpx_data = request.get_data(as_text=True)
    result = gpx_repo.save_gpx(gpx_data)
    return jsonify({'inserted_id': str(result.inserted_id)})

@app.route('/api/routes', methods=['GET'])
def get_routes():
    routes = gpx_repo.get_all_gpx()
    for route in routes:
        route['_id'] = str(route['_id'])
    return jsonify(routes)

if __name__ == '__main__':
    app.run(debug=True)
