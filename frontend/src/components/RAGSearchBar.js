import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SearchBar.css'; // Reuse the existing CSS for consistency

const RAGSearchBar = () => {
    const [query, setQuery] = useState('');
    const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey') || '');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (apiKey) {
            localStorage.setItem('apiKey', apiKey);
            // Set a timeout to clear the key after 10 minutes
            const timeout = setTimeout(() => {
                localStorage.removeItem('apiKey');
            }, 10 * 60 * 1000); // 10 minutes in milliseconds

            return () => clearTimeout(timeout);
        }
    }, [apiKey]);

    const handleRAGSearch = async () => {
        try {
            const response = await axios.post('http://localhost:5000/rag_search', {
                query: query,
                api_key: apiKey
            });
            console.log('Gen AI Search Response:', response.data);  // Debugging line
            navigate('/rag_search_results', { state: { results: response.data.generated_results } });
        } catch (error) {
            console.error('Error fetching search results:', error);
            setError('Error fetching search results');
        }
    };

    return (
        <div className="search-container">
            <div className="search-bar">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for artists, albums, songs with RAG..."
                />
                <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key"
                />
                <button onClick={handleRAGSearch}>Gen AI Search</button>
            </div>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default RAGSearchBar;
