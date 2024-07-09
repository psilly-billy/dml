
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Artists from './components/Artists';
import Artist from './components/Artist';
import Album from './components/Album';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Artists />} />
                <Route path="/artists/:name" element={<Artist />} />
                <Route path="/albums/:title" element={<Album />} />
            </Routes>
        </Router>
    );
};

export default App;
