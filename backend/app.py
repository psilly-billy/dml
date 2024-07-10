
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

# Connect to MongoDB
client = MongoClient('localhost', 27017)
db = client['music_library']

@app.route('/artists', methods=['GET'])
def get_artists():
    artists = db.artists.find()
    artist_list = [artist['name'] for artist in artists]
    return jsonify(artist_list)

@app.route('/artists/<artist_name>', methods=['GET'])
def get_artist(artist_name):
    artist = db.artists.find_one({"name": artist_name})
    if artist:
        albums = db.albums.find({"artist": artist_name})
        artist["albums"] = [album["title"] for album in albums]
        return jsonify(artist)
    else:
        return jsonify({"error": "Artist not found"}), 404

@app.route('/albums/<album_title>', methods=['GET'])
def get_album(album_title):
    album = db.albums.find_one({"title": album_title})
    if album:
        return jsonify(album)
    else:
        return jsonify({"error": "Album not found"}), 404


# Add a new artist
@app.route('/artists', methods=['POST'])
def add_artist():
    data = request.get_json()
    if 'name' in data:
        artist = {
            "name": data['name'],
            "albums": []
        }
        db.artists.insert_one(artist)
        return jsonify({"message": "Artist added successfully"}), 201
    else:
        return jsonify({"error": "Invalid data"}), 400

# Update an artist
@app.route('/artists/<artist_name>', methods=['PUT'])
def update_artist(artist_name):
    data = request.get_json()
    updated_artist = db.artists.find_one_and_update(
        {"name": artist_name},
        {"$set": data},
        return_document=True
    )
    if updated_artist:
        return jsonify(serialize_doc(updated_artist))
    else:
        return jsonify({"error": "Artist not found"}), 404

# Delete an artist
@app.route('/artists/<artist_name>', methods=['DELETE'])
def delete_artist(artist_name):
    result = db.artists.delete_one({"name": artist_name})
    if result.deleted_count > 0:
        db.albums.delete_many({"artist": artist_name})
        return jsonify({"message": "Artist deleted successfully"})
    else:
        return jsonify({"error": "Artist not found"}), 404

# Add a new album
@app.route('/albums', methods=['POST'])
def add_album():
    data = request.get_json()
    if 'title' in data and 'artist' in data:
        album = {
            "artist": data['artist'],
            "title": data['title'],
            "songs": data.get('songs', []),
            "description": data.get('description', "")
        }
        db.albums.insert_one(album)
        db.artists.update_one({"name": data['artist']}, {"$push": {"albums": data['title']}})
        return jsonify({"message": "Album added successfully"}), 201
    else:
        return jsonify({"error": "Invalid data"}), 400

# Update an album
@app.route('/albums/<album_title>', methods=['PUT'])
def update_album(album_title):
    data = request.get_json()
    updated_album = db.albums.find_one_and_update(
        {"title": album_title},
        {"$set": data},
        return_document=True
    )
    if updated_album:
        return jsonify(serialize_doc(updated_album))
    else:
        return jsonify({"error": "Album not found"}), 404

# Delete an album
@app.route('/albums/<album_title>', methods=['DELETE'])
def delete_album(album_title):
    album = db.albums.find_one({"title": album_title})
    if album:
        db.albums.delete_one({"title": album_title})
        db.artists.update_one({"name": album['artist']}, {"$pull": {"albums": album_title}})
        return jsonify({"message": "Album deleted successfully"})
    else:
        return jsonify({"error": "Album not found"}), 404




if __name__ == '__main__':
    app.run(debug=True)
