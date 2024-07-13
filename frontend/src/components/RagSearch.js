import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css'; // Reuse the existing CSS for consistency

const RagSearch = ({ onResults }) => {
    const [query, setQuery] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRAGSearch = async () => {
        try {
            const response = await axios.post('http://localhost:5000/rag_search', {
                query: query,
                api_key: apiKey
            });
            console.log('Gen AI Search Response:', response.data);  // Debugging line
            onResults(response.data.generated_results);
            setError('');
            navigate('/rag_search_results');
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
                <button onClick={handleRAGSearch}>RAG Search</button>
            </div>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default RagSearch;
