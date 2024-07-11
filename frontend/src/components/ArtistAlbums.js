import React, { useEffect, useState } from 'react';
import { getArtist, addAlbum, deleteAlbum, getAlbum } from '../services/api';
import './ArtistAlbums.css';

const ArtistAlbums = ({ artistName, onSelectAlbum, selectedAlbum }) => {
    const [artist, setArtist] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [newAlbum, setNewAlbum] = useState({ title: '', description: '' });
    const [drawerStates, setDrawerStates] = useState({});

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

    const handleInfoClick = async (album) => {
        if (drawerStates[album]) {
            setDrawerStates(prevStates => ({
                ...prevStates,
                [album]: null
            }));
        } else {
            const response = await getAlbum(album);
            setDrawerStates(prevStates => ({
                ...prevStates,
                [album]: response.data.description
            }));
        }
    };

    if (!artistName) return <div className="albums">Select an artist to view albums</div>;
    if (!artist) return <div className="albums">Loading...</div>;

    return (
        <div className="albums">
            <h2>{artist.name}'s Albums</h2>
            <ul>
                {artist.albums.map(album => (
                    <li key={album} className={`album-item ${selectedAlbum === album ? 'selected' : ''}`}>
                        <div className="album-header">
                            <span onClick={() => onSelectAlbum(album)}>{album}</span>
                            <button className="info-button" onClick={() => handleInfoClick(album)}>Info</button>
                            <button className="delete-button" onClick={() => handleDeleteAlbum(album)}>Delete</button>
                        </div>
                        {drawerStates[album] && (
                            <div className="album-description-drawer">
                                <div className="album-description-content">
                                    <p>{drawerStates[album]}</p>
                                </div>
                            </div>
                        )}
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
