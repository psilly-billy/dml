
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAlbum, deleteSong } from '../services/api';
import SongForm from './SongForm';

const Album = () => {
    const { title } = useParams();
    const [album, setAlbum] = useState(null);

    const fetchAlbum = async () => {
        const response = await getAlbum(title);
        setAlbum(response.data);
    };

    useEffect(() => {
        fetchAlbum();
    }, [title]);

    const handleDelete = async (songTitle) => {
        await deleteSong(title, songTitle);
        fetchAlbum();
    };

    if (!album) return <div>Loading...</div>;

    return (
        <div>
            <h1>{album.title}</h1>
            <p>{album.description}</p>
            <h2>Songs</h2>
            <SongForm albumTitle={album.title} onSongAdded={fetchAlbum} />
            <ul>
                {album.songs.map(song => (
                    <li key={song.title}>
                        {song.title} ({song.length})
                        <button onClick={() => handleDelete(song.title)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Album;
