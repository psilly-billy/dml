import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import ArtistAlbums from './ArtistAlbums';
import AlbumSongs from './AlbumSongs';
import DOMPurify from 'dompurify';
import './RagSearchResults.css';

const RagSearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const results = location.state?.results || [];
    const [selectedArtist, setSelectedArtist] = useState(null);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [selectedSong, setSelectedSong] = useState(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [updatedSong, setUpdatedSong] = useState({ title: '', length: '' });

    console.log('Results received:', results); // Debugging line

    const handleBack = () => {
        navigate('/');
    };

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
            } catch (err) {
                alert('Error updating song');
            }
        }
    };

    return (
        <div className="search-results-page">
            <div className="library-header">
                <button className="home-button" onClick={handleBack}>Back</button>
            </div>
            <div className="search-results">
                <h2>RAG Search Results</h2>
                {results.length > 0 ? (
                    <ul>
                        {results.map((result, index) => (
                            <li key={index} className="result-item">
                                {result.artist && (
                                    <span onClick={() => handleArtistClick(result.artist)}>
                                        Artist: {DOMPurify.sanitize(result.artist)}
                                    </span>
                                )}
                                {result.album && (
                                    <span onClick={() => handleAlbumClick(result.album)}>
                                        Album: {DOMPurify.sanitize(result.album)} by {DOMPurify.sanitize(result.artist)}
                                    </span>
                                )}
                                {result.song && (
                                    <span onClick={() => handleSongClick(result)}>
                                        Song: {DOMPurify.sanitize(result.song)} from {DOMPurify.sanitize(result.album)} by {DOMPurify.sanitize(result.artist)}
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
                        <h3>{DOMPurify.sanitize(selectedSong.song)}</h3>
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

export default RagSearchResults;
