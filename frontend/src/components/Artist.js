import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getArtist } from '../services/api';

const Artist = () => {
    const { name } = useParams();
    const [artist, setArtist] = useState(null);

    useEffect(() => {
        getArtist(name).then(response => {
            setArtist(response.data);
        });
    }, [name]);

    if (!artist) return <div>Loading...</div>;

    return (
        <div>
            <h1>{artist.name}</h1>
            <h2>Albums</h2>
            <ul>
                {artist.albums.map(album => (
                    <li key={album}>{album}</li>
                ))}
            </ul>
        </div>
    );
};

export default Artist;