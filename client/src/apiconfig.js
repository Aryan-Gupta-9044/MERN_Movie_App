// Base URL for the Express API
// Local development: http://localhost:5001/api
// Production: Render backend with /api

const configuredApiUrl = import.meta.env.VITE_API_URL;

let API_BASE_URL;

if (configuredApiUrl) {
    // Remove trailing slash
    API_BASE_URL = configuredApiUrl.replace(/\/+$/, '');

    // Make sure /api is included
    if (!API_BASE_URL.endsWith('/api')) {
        API_BASE_URL += '/api';
    }
} else {
    // Default production API
    API_BASE_URL = 'https://mern-movie-app-9rj2.onrender.com/api';
}

export const API_ENDPOINTS = {
    HEALTH: `${API_BASE_URL}/health`,
    MOVIES: `${API_BASE_URL}/movies`,
    FEATURED: `${API_BASE_URL}/movies/featured`,
    GENRES: `${API_BASE_URL}/movies/genres`,
    MOVIE_DETAIL: (id) => `${API_BASE_URL}/movies/${id}`,
};