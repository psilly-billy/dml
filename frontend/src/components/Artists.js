import React, { useEffect, useState } from 'react';
import { getArtists, addArtist, deleteArtist, updateArtist } from '../services/api';
import './Artists.css';

const Artists = ({ onSelectArtist, selectedArtist, searchQuery }) => {
    const [artists, setArtists] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newArtist, setNewArtist] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editArtist, setEditArtist] = useState('');
    const [currentArtist, setCurrentArtist] = useState('');

    useEffect(() => {
        getArtists().then(response => {
            setArtists(response.data);
        });
    }, []);

    const filteredArtists = artists.filter(artist => artist.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleAddArtist = async () => {
        if (newArtist) {
            await addArtist({ name: newArtist });
            setNewArtist('');
            setShowForm(false);
            getArtists().then(response => {
                setArtists(response.data);
            });
        }
    };

    const handleDeleteArtist = async (artist) => {
        await deleteArtist(artist);
        getArtists().then(response => {
            setArtists(response.data);
        });
    };

    const handleEditArtist = (artist) => {
        setEditMode(true);
        setCurrentArtist(artist);
        setEditArtist(artist);
    };

    const handleUpdateArtist = async () => {
        if (editArtist && currentArtist) {
            await updateArtist(currentArtist, { name: editArtist });
            setEditMode(false);
            setEditArtist('');
            setCurrentArtist('');
            getArtists().then(response => {
                setArtists(response.data);
            });
        }
    };

    return (
        <div className="artists">
            <h2>Artists</h2>
            <ul>
                {filteredArtists.map(artist => (
                    <li key={artist} className={`artist-item ${selectedArtist === artist ? 'selected' : ''}`}>
                        <span onClick={() => onSelectArtist(artist)}>{artist}</span>
                        <div className="artist-buttons">
                            <button className="edit-button" onClick={() => handleEditArtist(artist)}>Edit</button>
                            <button className="delete-button" onClick={() => handleDeleteArtist(artist)}>Delete</button>
                        </div>
                        {editMode && currentArtist === artist && (
                            <div className="artist-form">
                                <input 
                                    type="text" 
                                    placeholder="Edit Artist Name" 
                                    value={editArtist} 
                                    onChange={(e) => setEditArtist(e.target.value)} 
                                />
                                <div className="edit-buttons">
                                    <button onClick={handleUpdateArtist}>Update</button>
                                    <button onClick={() => setEditMode(false)}>Cancel</button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            <button onClick={() => setShowForm(!showForm)}>Add Artist</button>
            {showForm && (
                <div className="artist-form">
                    <input 
                        type="text" 
                        placeholder="New Artist Name" 
                        value={newArtist} 
                        onChange={(e) => setNewArtist(e.target.value)} 
                    />
                    <button onClick={handleAddArtist}>Add</button>
                </div>
            )}
        </div>
    );
};

export default Artists;
