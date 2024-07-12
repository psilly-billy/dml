import React, { useEffect, useState } from 'react';
import { getAlbum, addSong, deleteSong, updateSong } from '../services/api';
import './AlbumSongs.css';

const AlbumSongs = ({ albumTitle }) => {
    const [album, setAlbum] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [newSong, setNewSong] = useState({ title: '', length: '' });
    const [selectedSong, setSelectedSong] = useState(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [updatedSong, setUpdatedSong] = useState({ title: '', length: '' });

    useEffect(() => {
        if (albumTitle) {
            getAlbum(albumTitle).then(response => {
                setAlbum(response.data);
            });
        }
    }, [albumTitle]);

    const handleAddSong = async () => {
        if (newSong.title && newSong.length && albumTitle) {
            await addSong(albumTitle, newSong);
            setNewSong({ title: '', length: '' });
            setShowForm(false);
            getAlbum(albumTitle).then(response => {
                setAlbum(response.data);
            });
        }
    };

    const handleDeleteSong = async (songTitle) => {
        await deleteSong(albumTitle, songTitle);
        getAlbum(albumTitle).then(response => {
            setAlbum(response.data);
        });
    };

    const handleUpdateSong = async () => {
        if (updatedSong.title && updatedSong.length) {
            await updateSong(albumTitle, selectedSong.title, updatedSong);
            setUpdatedSong({ title: '', length: '' });
            setShowUpdateForm(false);
            getAlbum(albumTitle).then(response => {
                setAlbum(response.data);
            });
        }
    };

    const handlePlaySong = (song) => {
        alert(`Playing song: ${song.title}`);
    };

    const handleAddToPlaylist = (song) => {
        alert(`Adding song to playlist: ${song.title}`);
    };

    if (!albumTitle) return <div className="songs">Select an album to view songs</div>;
    if (!album) return <div className="songs">Loading...</div>;

    return (
        <div className="songs">
            <h2>{album.title}</h2>
            <ul>
                {album.songs.map(song => (
                    <li key={song.title} className="song-item">
                        <div>
                            <span>{song.title} ({song.length})</span>
                        </div>
                        <div className="song-actions">
                            <button className="play-button" onClick={() => handlePlaySong(song)}>Play</button>
                            <button className="playlist-button" onClick={() => handleAddToPlaylist(song)}>Add to Playlist</button>
                            <button className="delete-button" onClick={() => handleDeleteSong(song.title)}>Delete</button>
                            <button className="update-button" onClick={() => {
                                setSelectedSong(song);
                                setShowUpdateForm(!showUpdateForm);
                            }}>Edit</button>
                        </div>
                        {showUpdateForm && selectedSong && selectedSong.title === song.title && (
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
                                <div className="update-buttons">
                                    <button onClick={handleUpdateSong}>Update</button>
                                    <button onClick={() => setShowUpdateForm(false)}>Cancel</button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            <button onClick={() => setShowForm(!showForm)}>Add Song</button>
            {showForm && (
                <div className="song-form">
                    <input 
                        type="text" 
                        placeholder="Song Title" 
                        value={newSong.title} 
                        onChange={(e) => setNewSong({ ...newSong, title: e.target.value })} 
                    />
                    <input 
                        type="text" 
                        placeholder="Song Length" 
                        value={newSong.length} 
                        onChange={(e) => setNewSong({ ...newSong, length: e.target.value })} 
                    />
                    <button onClick={handleAddSong}>Add</button>
                </div>
            )}
        </div>
    );
};

export default AlbumSongs;
