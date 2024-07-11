import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import ArtistAlbums from './ArtistAlbums';
import AlbumSongs from './AlbumSongs';
import './SearchResults.css';

const SearchResults = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('q');
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [selectedArtist, setSelectedArtist] = useState(null);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/search?q=${encodeURIComponent(query)}`);
                setResults(response.data);
            } catch (err) {
                setError('Error fetching search results');
            }
        };

        if (query) {
            fetchResults();
        }
    }, [query]);

    const handleArtistClick = (artist) => {
        setSelectedArtist(artist);
        setSelectedAlbum(null);
    };

    const handleAlbumClick = (album) => {
        setSelectedAlbum(album);
    };

    const handleHomeNavigation = () => {
        navigate('/');
    };

    if (error) {
        return <div className="search-results"><p className="error-message">{error}</p></div>;
    }

    return (
        <div className="search-results-page">
            <div className="library-header">
                <button className="home-button" onClick={handleHomeNavigation}>Home</button>
            </div>
            <div className="search-results">
                <h2>Search Results for "{DOMPurify.sanitize(query)}"</h2>
                {results.length > 0 ? (
                    <ul>
                        {results.map((result, index) => (
                            <li key={index} className="result-item">
                                {result.type === 'artist' && (
                                    <span onClick={() => handleArtistClick(result.name)}>
                                        Artist: {DOMPurify.sanitize(result.name)}
                                    </span>
                                )}
                                {result.type === 'album' && (
                                    <span onClick={() => handleAlbumClick(result.title)}>
                                        Album: {DOMPurify.sanitize(result.title)} by {DOMPurify.sanitize(result.artist)}
                                    </span>
                                )}
                                {result.type === 'song' && (
                                    <span>
                                        Song: {DOMPurify.sanitize(result.title)} from {DOMPurify.sanitize(result.album)} by {DOMPurify.sanitize(result.artist)}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No results found</p>
                )}
            </div>
            <div className="interactive-blocks">
                {selectedArtist && (
                    <div className="block albums-block">
                        <ArtistAlbums
                            artistName={selectedArtist}
                            onSelectAlbum={(album) => handleAlbumClick(album)}
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
        </div>
    );
};

export default SearchResults;
