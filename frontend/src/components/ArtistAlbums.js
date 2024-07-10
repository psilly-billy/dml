import React, { useEffect, useState } from 'react';
import { getArtist, addAlbum, deleteAlbum } from '../services/api';
import './ArtistAlbums.css';

const ArtistAlbums = ({ artistName, onSelectAlbum, selectedAlbum }) => {
    const [artist, setArtist] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [newAlbum, setNewAlbum] = useState({ title: '', description: '' });

    useEffect(() => {
        if (artistName) {
            getArtist(artistName).then(response => {
                setArtist(response.data);
            });
        }
    }, [artistName]);

    const handleAddAlbum = async () => {
        if (newAlbum.title && artistName) {
            await addAlbum({ ...newAlbum, artist: artistName });
            setNewAlbum({ title: '', description: '' });
            setShowForm(false);
            getArtist(artistName).then(response => {
                setArtist(response.data);
            });
        }
    };

    const handleDeleteAlbum = async (album) => {
        await deleteAlbum(album);
        getArtist(artistName).then(response => {
            setArtist(response.data);
        });
    };

    if (!artistName) return <div className="albums">Select an artist to view albums</div>;
    if (!artist) return <div className="albums">Loading...</div>;

    return (
        <div className="albums">
            <h2>{artist.name}'s Albums</h2>
            <ul>
                {artist.albums.map(album => (
                    <li key={album} className={`album-item ${selectedAlbum === album ? 'selected' : ''}`}>
                        <span onClick={() => onSelectAlbum(album)}>{album}</span>
                        <button className="delete-button" onClick={() => handleDeleteAlbum(album)}>Delete</button>
                    </li>
                ))}
            </ul>
            <button onClick={() => setShowForm(!showForm)}>Add Album</button>
            {showForm && (
                <div className="album-form">
                    <input 
                        type="text" 
                        placeholder="Album Title" 
                        value={newAlbum.title} 
                        onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })} 
                    />
                    <textarea 
                        placeholder="Album Description" 
                        value={newAlbum.description} 
                        onChange={(e) => setNewAlbum({ ...newAlbum, description: e.target.value })} 
                    />
                    <button onClick={handleAddAlbum}>Add</button>
                </div>
            )}
        </div>
    );
};

export default ArtistAlbums;
