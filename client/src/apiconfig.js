// This file determines the base URL for API calls.
// In development (local): VITE_API_URL is undefined, so it uses localhost:5001 (via Vite Proxy).
// In production (Vercel): VITE_API_URL is set to the Railway URL.

// NOTE: We need to use 'export' here so App.jsx can import both API_BASE_URL 
// and API_ENDPOINTS.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const API_ENDPOINTS = {
    // Note: The /api prefix must be included here as it is the base path
    // defined in the Express router on the Railway server.
    HEALTH: `${API_BASE_URL}/api/health`,
    MOVIES_SEARCH: `${API_BASE_URL}/api/movies/search`,
};
// client/src/config.js
//export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
// You might also have this if you want to export endpoints directly
