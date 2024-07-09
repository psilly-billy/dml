
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

if __name__ == '__main__':
    app.run(debug=True)
