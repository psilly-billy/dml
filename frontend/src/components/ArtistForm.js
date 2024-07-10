
import React, { useState } from 'react';
import { addArtist } from '../services/api';

const ArtistForm = ({ onArtistAdded }) => {
    const [name, setName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addArtist({ name });
        setName('');
        onArtistAdded();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                />
            </div>
            <button type="submit">Add Artist</button>
        </form>
    );
};

export default ArtistForm;
