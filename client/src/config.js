// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const API_ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/api/health`,
  MOVIES_SEARCH: `${API_BASE_URL}/api/movies/search`,
};

export default API_BASE_URL;
