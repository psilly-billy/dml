import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import ArtistAlbums from './ArtistAlbums';
import AlbumSongs from './AlbumSongs';
import './SearchResults.css';

const SearchResults = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('q');
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [selectedArtist, setSelectedArtist] = useState(null);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [selectedSong, setSelectedSong] = useState(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [updatedSong, setUpdatedSong] = useState({ title: '', length: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/search?q=${encodeURIComponent(query)}`);
                setResults(response.data);
            } catch (err) {
                setError('Error fetching search results');
            }
        };

        if (query) {
            fetchResults();
        }
    }, [query]);

    const handleArtistClick = (artist) => {
        setSelectedArtist(artist);
        setSelectedAlbum(null);
        setSelectedSong(null);
    };

    const handleAlbumClick = (album) => {
        setSelectedAlbum(album);
        setSelectedSong(null);
    };

    const handleSongClick = (song) => {
        setSelectedSong(song);
    };

    const handleHomeNavigation = () => {
        navigate('/');
    };

    const handlePlaySong = (song) => {
        alert(`Playing song: ${song.title}`);
    };

    const handleAddToPlaylist = (song) => {
        alert(`Adding song to playlist: ${song.title}`);
    };

    const handleDeleteSong = async (song) => {
        try {
            await axios.delete(`http://localhost:5000/albums/${encodeURIComponent(song.album)}/songs/${encodeURIComponent(song.title)}`);
            alert(`Deleted song: ${song.title}`);
            // Optionally refresh the search results after deletion
            const response = await axios.get(`http://localhost:5000/search?q=${encodeURIComponent(query)}`);
            setResults(response.data);
        } catch (err) {
            alert('Error deleting song');
        }
    };

    const handleUpdateSong = async () => {
        if (updatedSong.title && updatedSong.length) {
            try {
                await axios.put(`http://localhost:5000/albums/${encodeURIComponent(selectedSong.album)}/songs/${encodeURIComponent(selectedSong.title)}`, updatedSong);
                alert(`Updated song: ${selectedSong.title}`);
                setShowUpdateForm(false);
                setUpdatedSong({ title: '', length: '' });
                // Optionally refresh the search results after update
                const response = await axios.get(`http://localhost:5000/search?q=${encodeURIComponent(query)}`);
                setResults(response.data);
            } catch (err) {
                alert('Error updating song');
            }
        }
    };

    if (error) {
        return <div className="search-results"><p className="error-message">{error}</p></div>;
    }

    return (
        <div className="search-results-page">
            <div className="library-header">
                <button className="home-button" onClick={handleHomeNavigation}>Back</button>
            </div>
            <div className="search-results">
                <h2>Search Results for "{DOMPurify.sanitize(query)}"</h2>
                {results.length > 0 ? (
                    <ul>
                        {results.map((result, index) => (
                            <li key={index} className="result-item">
                                {result.type === 'artist' && (
                                    <span onClick={() => handleArtistClick(result.name)}>
                                        Artist: {DOMPurify.sanitize(result.name)}
                                    </span>
                                )}
                                {result.type === 'album' && (
                                    <span onClick={() => handleAlbumClick(result.title)}>
                                        Album: {DOMPurify.sanitize(result.title)} by {DOMPurify.sanitize(result.artist)}
                                    </span>
                                )}
                                {result.type === 'song' && (
                                    <span onClick={() => handleSongClick(result)}>
                                        Song: {DOMPurify.sanitize(result.title)} from {DOMPurify.sanitize(result.album)} by {DOMPurify.sanitize(result.artist)}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No results found</p>
                )}
            </div>
            <div className="interactive-blocks">
                {selectedArtist && (
                    <div className="block albums-block">
                        <ArtistAlbums
                            artistName={selectedArtist}
                            onSelectAlbum={(album) => handleAlbumClick(album)}
                            selectedAlbum={selectedAlbum}
                        />
                    </div>
                )}
                {selectedAlbum && !selectedSong && (
                    <div className="block songs-block">
                        <AlbumSongs albumTitle={selectedAlbum} />
                    </div>
                )}
                {selectedSong && (
                    <div className="block song-details">
                        <h3>{DOMPurify.sanitize(selectedSong.title)}</h3>
                        <p>Album: {DOMPurify.sanitize(selectedSong.album)}</p>
                        <p>Artist: {DOMPurify.sanitize(selectedSong.artist)}</p>
                        <p>Length: {DOMPurify.sanitize(selectedSong.length)}</p>
                        <button onClick={() => handlePlaySong(selectedSong)}>Play</button>
                        <button onClick={() => handleAddToPlaylist(selectedSong)}>Add to Playlist</button>
                        <button onClick={() => handleDeleteSong(selectedSong)}>Delete</button>
                        <button onClick={() => setShowUpdateForm(!showUpdateForm)}>Update</button>
                        {showUpdateForm && (
                            <div className="song-update-form">
                                <input
                                    type="text"
                                    placeholder="New Song Title"
                                    value={updatedSong.title}
                                    onChange={(e) => setUpdatedSong({ ...updatedSong, title: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="New Song Length"
                                    value={updatedSong.length}
                                    onChange={(e) => setUpdatedSong({ ...updatedSong, length: e.target.value })}
                                />
                                <button onClick={handleUpdateSong}>Update</button>
                                <button onClick={() => setShowUpdateForm(false)}>Cancel</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
