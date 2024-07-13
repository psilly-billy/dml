
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';
import LibraryPage from './components/LibraryPage';
import SearchResults from './components/SearchResults';
import RagSearch from './components/RagSearch';
import RagSearchResults from './components/RagSearchResults';
import './App.css';

const App = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [ragResults, setRagResults] = useState([]);

    const handleRagResults = (results) => {
        setRagResults(results);
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage onSearch={(query) => setSearchQuery(query)} />} />
                <Route path="/library" element={<LibraryPage searchQuery={searchQuery} />} />
                <Route path="/rag_search_results" element={<RagSearchResults />} />
                <Route path="/search" element={<SearchResults />} />
            </Routes>
        </Router>
    );
};

export default App;
