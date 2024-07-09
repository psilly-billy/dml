
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000'
});

export const getArtists = () => api.get('/artists');
export const getArtist = (artistName) => api.get(`/artists/${artistName}`);
export const getAlbum = (albumTitle) => api.get(`/albums/${albumTitle}`);
