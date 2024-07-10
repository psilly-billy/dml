
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000'
});

export const getArtists = () => api.get('/artists');
export const getArtist = (artistName) => api.get(`/artists/${artistName}`);
export const addArtist = (artist) => api.post('/artists', artist);
export const updateArtist = (artistName, artist) => api.put(`/artists/${artistName}`, artist);
export const deleteArtist = (artistName) => api.delete(`/artists/${artistName}`);

export const getAlbum = (albumTitle) => api.get(`/albums/${albumTitle}`);
export const addAlbum = (album) => api.post('/albums', album);
export const updateAlbum = (albumTitle, album) => api.put(`/albums/${albumTitle}`, album);
export const deleteAlbum = (albumTitle) => api.delete(`/albums/${albumTitle}`);

export const addSong = (albumTitle, song) => api.post(`/albums/${albumTitle}/songs`, song);
export const updateSong = (albumTitle, songTitle, song) => api.put(`/albums/${albumTitle}/songs/${songTitle}`, song);
export const deleteSong = (albumTitle, songTitle) => api.delete(`/albums/${albumTitle}/songs/${songTitle}`);
