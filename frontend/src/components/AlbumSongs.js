import React, { useEffect, useState } from 'react';
import { getAlbum, addSong, deleteSong } from '../services/api';
import './AlbumSongs.css';

const AlbumSongs = ({ albumTitle }) => {
    const [album, setAlbum] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [newSong, setNewSong] = useState({ title: '', length: '' });

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

    if (!albumTitle) return <div className="songs">Select an album to view songs</div>;
    if (!album) return <div className="songs">Loading...</div>;

    return (
        <div className="songs">
            <h2>{album.title}</h2>
            <ul>
                {album.songs.map(song => (
                    <li key={song.title} className="song-item">
                        <span>{song.title} ({song.length})</span>
                        <button className="delete-button" onClick={() => handleDeleteSong(song.title)}>Delete</button>
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
