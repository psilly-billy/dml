
from pymongo import MongoClient
import json

# Connect to MongoDB
client = MongoClient('localhost', 27017)
db = client['music_library']

# Drop existing collections
db.artists.drop()
db.albums.drop()

# Load data from JSON file
with open('Data\data.json') as f:
    data = json.load(f)

# Insert data into MongoDB
for artist in data:
    artist_doc = {
        "name": artist["name"],
        "albums": [album["title"] for album in artist["albums"]]
    }
    db.artists.insert_one(artist_doc)

    for album in artist["albums"]:
        album_doc = {
            "artist": artist["name"],
            "title": album["title"],
            "songs": album["songs"],
            "description": album["description"]
        }
        db.albums.insert_one(album_doc)

print("Data imported successfully!")
