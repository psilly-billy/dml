
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAlbum } from '../services/api';

const Album = () => {
    const { title } = useParams();
    const [album, setAlbum] = useState(null);

    useEffect(() => {
        getAlbum(title).then(response => {
            setAlbum(response.data);
        });
    }, [title]);

    if (!album) return <div>Loading...</div>;

    return (
        <div>
            <h1>{album.title}</h1>
            <p>{album.description}</p>
            <h2>Songs</h2>
            <ul>
                {album.songs.map(song => (
                    <li key={song.title}>
                        {song.title} ({song.length})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Album;
