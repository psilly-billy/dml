import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Artists from './Artists';
import ArtistAlbums from './ArtistAlbums';
import AlbumSongs from './AlbumSongs';
import './LibraryPage.css';

const LibraryPage = ({ searchQuery }) => {
    const [selectedArtist, setSelectedArtist] = useState(null);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const navigate = useNavigate();

    const handleHomeNavigation = () => {
        navigate('/');
    };

    return (
        <div className="library-page">
            <div className="library-header">
                <button className="home-button" onClick={handleHomeNavigation}>Home</button>
            </div>
            <div className="block artists-block">
                <Artists 
                    onSelectArtist={(artist) => {
                        setSelectedArtist(artist);
                        setSelectedAlbum(null);
                    }} 
                    selectedArtist={selectedArtist}
                    searchQuery={searchQuery}
                />
            </div>
            {selectedArtist && (
                <div className="block albums-block">
                    <ArtistAlbums 
                        artistName={selectedArtist} 
                        onSelectAlbum={(album) => setSelectedAlbum(album)}
                        selectedAlbum={selectedAlbum}
                    />
                </div>
            )}
            {selectedAlbum && (
                <div className="block songs-block">
                    <AlbumSongs albumTitle={selectedAlbum} />
                </div>
            )}
        </div>
    );
};

export default LibraryPage;
