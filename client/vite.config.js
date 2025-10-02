import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Shorthand notation: forwards all requests starting with '/api'
      // directly to the server running at http://127.0.0.1:5001 (or http://localhost:5001)
      '/api': 'http://127.0.0.1:5001', 
    }
  }
})