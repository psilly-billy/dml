
import React, { useState } from 'react';
import { addSong } from '../services/api';

const SongForm = ({ albumTitle, onSongAdded }) => {
    const [title, setTitle] = useState('');
    const [length, setLength] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addSong(albumTitle, { title, length });
        setTitle('');
        setLength('');
        onSongAdded();
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
                <label>Length:</label>
                <input 
                    type="text" 
                    value={length} 
                    onChange={(e) => setLength(e.target.value)} 
                    required 
                />
            </div>
            <button type="submit">Add Song</button>
        </form>
    );
};

export default SongForm;
