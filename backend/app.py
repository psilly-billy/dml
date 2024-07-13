from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from pymongo import MongoClient
import re
import google.generativeai as genai
import json

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Connect to MongoDB
client = MongoClient('localhost', 27017)
db = client['music_library']

# Rate limiter
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["2000 per day", "500 per hour"]
)

#function to serialize MongoDB documents
def serialize_doc(doc):
    doc['_id'] = str(doc['_id'])
    return doc



@app.route('/artists', methods=['GET'])
def get_artists():
    artists = db.artists.find()
    artist_list = [artist['name'] for artist in artists]
    return jsonify(artist_list)

@app.route('/artists/<artist_name>', methods=['GET'])
def get_artist(artist_name):
    artist = db.artists.find_one({"name": artist_name})
    if artist:
        artist = serialize_doc(artist)
        albums = db.albums.find({"artist": artist_name})
        artist["albums"] = [serialize_doc(album)["title"] for album in albums]
        return jsonify(artist)
    else:
        return jsonify({"error": "Artist not found"}), 404

@app.route('/albums/<album_title>', methods=['GET'])
def get_album(album_title):
    album = db.albums.find_one({"title": album_title})
    if album:
        return jsonify(serialize_doc(album))
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

# Add a song to an album
@app.route('/albums/<album_title>/songs', methods=['POST'])
def add_song(album_title):
    album = db.albums.find_one({"title": album_title})
    if album:
        data = request.get_json()
        song = {
            "title": data['title'],
            "length": data['length']
        }
        db.albums.update_one({"title": album_title}, {"$push": {"songs": song}})
        return jsonify({"message": "Song added successfully"}), 201
    else:
        return jsonify({"error": "Album not found"}), 404

# Update a song in an album
@app.route('/albums/<album_title>/songs/<song_title>', methods=['PUT'])
def update_song(album_title, song_title):
    album = db.albums.find_one({"title": album_title})
    if album:
        data = request.get_json()
        db.albums.update_one(
            {"title": album_title, "songs.title": song_title},
            {"$set": {"songs.$": data}}
        )
        return jsonify({"message": "Song updated successfully"})
    else:
        return jsonify({"error": "Album not found"}), 404

# Delete a song from an album
@app.route('/albums/<album_title>/songs/<song_title>', methods=['DELETE'])
def delete_song(album_title, song_title):
    album = db.albums.find_one({"title": album_title})
    if album:
        db.albums.update_one(
            {"title": album_title},
            {"$pull": {"songs": {"title": song_title}}}
        )
        return jsonify({"message": "Song deleted successfully"})
    else:
        return jsonify({"error": "Album not found"}), 404

@app.route('/search', methods=['GET'])
@limiter.limit("60 per minute")
def search():
    query = request.args.get('q', '')
    if not query:
        return jsonify([])

    # Split the query into words and create a regex pattern that matches all words in any order
    words = query.split()
    regex_pattern = ".*".join(re.escape(word) for word in words)

    artists = list(db.artists.find({"name": {"$regex": regex_pattern, "$options": "i"}}))
    albums = list(db.albums.find({"title": {"$regex": regex_pattern, "$options": "i"}}))
    songs = list(db.albums.find({"songs.title": {"$regex": regex_pattern, "$options": "i"}}))

    artist_results = [{"type": "artist", "name": artist['name']} for artist in artists]
    album_results = [{"type": "album", "title": album['title'], "artist": album['artist']} for album in albums]
    song_results = [{"type": "song", "title": song['title'], "length": song['length'], "album": album['title'], "artist": album['artist']}
                    for album in songs for song in album['songs'] if re.search(regex_pattern, song['title'], re.IGNORECASE)]

    results = artist_results + album_results + song_results
    return jsonify(results)

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not found"}), 404


# Configure Gemini
def configure_gemini(api_key):
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    return model.start_chat()

# Generate MongoDB query using Gemini
def generate_mongo_query(api_key, query):
    chat = configure_gemini(api_key)
    prompt = f"""
    Generate only a valid MongoDB query to retrieve relevant information from a music library database for the query: '{query}'.
    
    The database has collections for 'artists', 'albums', and 'songs'.
    
    Each 'artist' document has the following structure:
    {{
      "name": "Artist Name",
      "albums": ["Album Title 1", "Album Title 2", ...]
    }}
    
    Each 'album' document has the following structure:
    {{
      "artist": "Artist Name",
      "title": "Album Title",
      "description": "Album Description",
      "songs": [
        {{
          "title": "Song Title",
          "length": "Song Length"
        }},
        ...
      ]
    }}
    
    Each 'song' document is embedded within an 'album' document.

    The query needs to handle various edge cases where the user might not mention whether they want an artist, album, or song. The query should be able to retrieve relevant data regardless of the specificity of the input.

    Examples of valid MongoDB queries:
    
    Example query for searching an artist named 'Taylor':
    db.artists.aggregate([
      {{
        "$match": {{
          "name": {{ "$regex": "taylor", "$options": "i" }}
        }}
      }},
      {{
        "$lookup": {{
          "from": "albums",
          "localField": "name",
          "foreignField": "artist",
          "as": "albums"
        }}
      }},
      {{
        "$unwind": "$albums"
      }},
      {{
        "$unwind": "$albums.songs"
      }},
      {{
        "$project": {{
          "_id": 0,
          "artist": "$name",
          "album": "$albums.title",
          "song": "$albums.songs.title",
          "length": "$albums.songs.length"
        }}
      }}
    ])

     Example query for searching  'albums by taylor swift':
    db.artists.aggregate([
      {{
        "$match": {{
          "name": {{ "$regex": "taylor swift", "$options": "i" }}
        }}
      }},
      {{
        "$lookup": {{
          "from": "albums",
          "localField": "name",
          "foreignField": "artist",
          "as": "albums"
        }}
      }},
      {{
        "$unwind": "$albums"
      }},
      {{
        "$project": {{
          "_id": 0,
          "artist": "$name",
          "album": "$albums.title",
          "description": "$albums.description"
        }}
      }}
    ])

    For searching 'albums or songs about love':
    db.albums.aggregate([
      {{
        "$match": {{
          "$or": [
            {{ "title": {{ "$regex": "love", "$options": "i" }} }},
            {{ "description": {{ "$regex": "love", "$options": "i" }} }},
            {{ "songs.title": {{ "$regex": "love", "$options": "i" }} }}
          ]
        }}
      }},
      {{
        "$unwind": "$songs"
      }},
      {{
        "$project": {{
          "_id": 0,
          "artist": "$artist",
          "album": "$title",
          "song": "$songs.title",
          "length": "$songs.length"
        }}
      }}
    ])

    Provide only the MongoDB query without any explanations or comments.
    """
    
    response = chat.send_message(prompt, stream=True)
    response.resolve()  # Ensure the response is fully generated
    mongo_query_text = response.candidates[0].content.parts[0].text.strip()
    print("Generated MongoDB Query:", mongo_query_text)  # Debugging line
    return mongo_query_text

@app.route('/rag_search', methods=['POST'])
@limiter.limit("60 per minute")
def rag_search():
    data = request.get_json()
    user_query = data.get('query', '')
    api_key = data.get('api_key', '')

    if not user_query or not api_key:
        return jsonify({"error": "Query and API key are required"}), 400

    try:
        # Generate the MongoDB query
        mongo_query_text = generate_mongo_query(api_key, user_query)
        
        # Clean up the generated query text
        mongo_query_text = mongo_query_text.replace("```javascript", "").replace("```", "").strip()
        mongo_query_text = mongo_query_text.replace("db.artists.aggregate([", "[").replace("])", "]").strip()
        
        # Parse the cleaned query text to JSON
        mongo_query_list = json.loads(mongo_query_text)
        
        # Execute the generated query
        generated_results = list(db.artists.aggregate(mongo_query_list))
        print("Generated query results:", generated_results)  # Debugging line
        
        return jsonify({
            "generated_results": generated_results if isinstance(generated_results, list) else []
        })
    except json.JSONDecodeError as json_err:
        print("Error parsing MongoDB query:", str(json_err))  # Debugging line
        return jsonify({"error": "Invalid MongoDB query generated"}), 500
    except Exception as e:
        print("Error executing MongoDB query:", str(e))  # Debugging line
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
