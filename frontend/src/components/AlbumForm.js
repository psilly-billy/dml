
import React, { useState } from 'react';
import { addAlbum } from '../services/api';

const AlbumForm = ({ artistName, onAlbumAdded }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addAlbum({ artist: artistName, title, description });
        setTitle('');
        setDescription('');
        onAlbumAdded();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title:</label>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                />
            </div>
            <div>
                <label>Description:</label>
                <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                />
            </div>
            <button type="submit">Add Album</button>
        </form>
    );
};

export default AlbumForm;
