import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';
import LibraryPage from './components/LibraryPage';
import SearchResults from './components/SearchResults';
import './App.css';

const App = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage onSearch={(query) => setSearchQuery(query)} />} />
                <Route path="/library" element={<LibraryPage searchQuery="" />} />
                <Route path="/search" element={<SearchResults />} />
            </Routes>
        </Router>
    );
};

export default App;
