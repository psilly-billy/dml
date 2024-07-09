
import React, { useEffect, useState } from 'react';
import { getArtists } from '../services/api';

const Artists = () => {
    const [artists, setArtists] = useState([]);

    useEffect(() => {
        getArtists().then(response => {
            setArtists(response.data);
        });
    }, []);

    return (
        <div>
            <h1>Artists</h1>
            <ul>
                {artists.map(artist => (
                    <li key={artist}>{artist}</li>
                ))}
            </ul>
        </div>
    );
};

export default Artists;
