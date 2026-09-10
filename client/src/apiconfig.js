// Base URL for the Express API.
// Locally this falls back to http://localhost:5001/api; in production it's
// injected via the VITE_API_URL environment variable (set in Vercel).
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const API_ENDPOINTS = {
    HEALTH: `${API_BASE_URL}/health`,
    MOVIES: `${API_BASE_URL}/movies`,
    FEATURED: `${API_BASE_URL}/movies/featured`,
    GENRES: `${API_BASE_URL}/movies/genres`,
    MOVIE_DETAIL: (id) => `${API_BASE_URL}/movies/${id}`,
};
