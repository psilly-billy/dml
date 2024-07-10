import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';
import LibraryPage from './components/LibraryPage';
import './App.css';

const App = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage onSearch={(query) => setSearchQuery(query)} />} />
                <Route path="/library" element={<LibraryPage searchQuery={searchQuery} />} />
            </Routes>
        </Router>
    );
};

export default App;
