
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getArtist, deleteAlbum } from '../services/api';
import AlbumForm from './AlbumForm';

const Artist = () => {
    const { name } = useParams();
    const [artist, setArtist] = useState(null);

    const fetchArtist = async () => {
        const response = await getArtist(name);
        setArtist(response.data);
    };

    useEffect(() => {
        fetchArtist();
    }, [name]);

    const handleDelete = async (albumTitle) => {
        await deleteAlbum(albumTitle);
        fetchArtist();
    };

    if (!artist) return <div>Loading...</div>;

    return (
        <div>
            <h1>{artist.name}</h1>
            <h2>Albums</h2>
            <AlbumForm artistName={artist.name} onAlbumAdded={fetchArtist} />
            <ul>
                {artist.albums.map(album => (
                    <li key={album}>
                        {album}
                        <button onClick={() => handleDelete(album)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Artist;
