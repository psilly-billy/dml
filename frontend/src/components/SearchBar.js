import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify'; // Import DOMPurify to sanitize HTML
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const minChars = 3; // Minimum number of characters before starting search

    const handleSearch = async (e) => {
        e.preventDefault();
        if (query.length >= minChars) {
            onSearch(query);
            navigate(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    const handleResultClick = (resultQuery) => {
        setQuery(resultQuery);
        onSearch(resultQuery);
        navigate(`/search?q=${encodeURIComponent(resultQuery)}`);
    };

    useEffect(() => {
        const fetchResults = async () => {
            if (query.length >= minChars) {
                try {
                    const response = await axios.get(`http://localhost:5000/search?q=${encodeURIComponent(query)}`);
                    setResults(response.data);
                } catch (err) {
                    setError('Error fetching search results');
                }
            } else {
                setResults([]);
                setError(null);
            }
        };

        fetchResults();
    }, [query]);

    return (
        <div className="search-container">
            <form className="search-bar" onSubmit={handleSearch}>
                <input 
                    type="text" 
                    placeholder="Search artists, albums, or songs..." 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                />
                <button type="submit" disabled={query.length < minChars}>Search</button>
            </form>
            {error && <div className="error-message">{error}</div>}
            {results.length > 0 && (
                <ul className="autocomplete-results">
                    {results.map((result, index) => (
                        <li key={index} className="result-item" onClick={() => handleResultClick(result.name || result.title)}>
                            {result.type === 'artist' && <span>Artist: {DOMPurify.sanitize(result.name)}</span>}
                            {result.type === 'album' && <span>Album: {DOMPurify.sanitize(result.title)} by {DOMPurify.sanitize(result.artist)}</span>}
                            {result.type === 'song' && <span>Song: {DOMPurify.sanitize(result.title)} from {DOMPurify.sanitize(result.album)} by {DOMPurify.sanitize(result.artist)}</span>}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;
