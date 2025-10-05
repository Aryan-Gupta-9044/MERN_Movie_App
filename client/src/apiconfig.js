import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // NOTE: The proxy is only used during local development (npm run dev)
      '/api': 'http://127.0.0.1:5001', 
    }
  }
})


// NOTE: The VITE_API_URL environment variable (set in Vercel to https://mern-movie-app-9rj2.onrender.com)
// MUST now include the '/api' suffix in its value, so we don't duplicate it here.

// --------------------------------------------------------------------------------
// CRITICAL FIX: The base URL must include the '/api' prefix to avoid duplication 
// in the API_ENDPOINTS object below.
// --------------------------------------------------------------------------------
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const API_ENDPOINTS = {
    // FIXED: Removed the redundant '/api' prefix from the endpoint definitions.
    HEALTH: `${API_BASE_URL}/health`,
    MOVIES_SEARCH: `${API_BASE_URL}/movies/search`,
    // ... add other endpoints here if needed
};