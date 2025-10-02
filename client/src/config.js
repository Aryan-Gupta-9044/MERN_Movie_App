// client/src/config.js (or similar)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// All your API endpoints MUST use API_BASE_URL:
export const API_ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/api/health`,
  MOVIES_SEARCH: `${API_BASE_URL}/api/movies/search`,
  // ... other endpoints
};