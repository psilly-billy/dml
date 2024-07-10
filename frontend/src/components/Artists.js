
import React, { useEffect, useState } from 'react';
import { getArtists, deleteArtist } from '../services/api';
import ArtistForm from './ArtistForm';

const Artists = () => {
    const [artists, setArtists] = useState([]);

    const fetchArtists = async () => {
        const response = await getArtists();
        setArtists(response.data);
    };

    useEffect(() => {
        fetchArtists();
    }, []);

    const handleDelete = async (artistName) => {
        await deleteArtist(artistName);
        fetchArtists();
    };

    return (
        <div>
            <h1>Artists</h1>
            <ArtistForm onArtistAdded={fetchArtists} />
            <ul>
                {artists.map(artist => (
                    <li key={artist}>
                        {artist} 
                        <button onClick={() => handleDelete(artist)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Artists;
