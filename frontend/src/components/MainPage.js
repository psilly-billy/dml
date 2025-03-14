import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import RAGSearchBar from './RAGSearchBar';
import './MainPage.css';

const MainPage = ({ onSearch }) => {
    const navigate = useNavigate();

    const handleLibraryNavigation = () => {
        onSearch(''); // Clear the search query
        navigate('/library');
    };

    return (
        <div className="main-page">
            <SearchBar onSearch={onSearch} />
            <RAGSearchBar />
            <button className="library-button" onClick={handleLibraryNavigation}>Go to Library</button>
        </div>
    );
};

export default MainPage;
