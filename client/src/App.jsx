import React, { useState } from 'react';
import { Search, Film, Calendar, Globe, Clock, XCircle, Info } from 'lucide-react';
import './App.css'

// client/src/App.jsx (Ensure lines 4-7 are clean)

import React, { useState } from 'react';
import { Search, Film, Calendar, Globe, Clock, XCircle, Info } from 'lucide-react';
import './App.css'

// This is the only import that should be present for the config file
import { API_BASE_URL } from './apiConfig'; 
// --- MovieCard Component (for clean display) ---
// ... rest of the file




// --- MovieCard Component (for clean display) ---
const MovieCard = ({ movie }) => {
    if (!movie) return null;

    // Helper to format plot text
    const formatPlot = (plot) => {
        return plot && plot.length > 300 ? plot.substring(0, 300) + '...' : plot;
    };

    return (
        <div className="movie-card">
            <div className="movie-poster">
                <img 
                    src={movie.poster}
                    alt={`Poster for ${movie.title}`}
                    onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = "https://placehold.co/400x600/6366f1/ffffff?text=Poster+Unavailable";
                    }}
                />
                <div className="movie-meta">
                    <span className="chip"><Calendar className="icon-sm"/> Released: {movie.year}</span>
                </div>
            </div>
            <div>
                <h2 className="movie-title">{movie.title}</h2>
                <p>
                    {movie.genres && movie.genres.map((g, index) => (
                        <span key={index} className="chip">{g}</span>
                    ))}
                </p>
                <p className="movie-plot">
                    <Film className="icon-sm"/>
                    {formatPlot(movie.plot || 'Plot summary not available.')}
                </p>
                <div className="movie-runtime">
                    <Clock className="icon-sm" />
                    <span><strong>Runtime:</strong> {movie.runtime ? `${movie.runtime} minutes` : 'N/A'}</span>
                </div>
                <div className="movie-info">
                    <Info className="icon-sm" /> Data retrieved from MongoDB 'sample_mflix' collection via Express API.
                </div>
            </div>
        </div>
    );
};

// --- Main Application Component ---
function App() {
    const [searchTerm, setSearchTerm] = useState('');
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        setMovie(null);

        if (!searchTerm.trim()) {
            setError("Please enter a movie title to search.");
            setLoading(false);
            return;
        }

        try {
            // API_BASE_URL is now correctly imported and accessible
            const response = await fetch(`${API_BASE_URL}/api/movies/search?title=${encodeURIComponent(searchTerm)}`);

            // Attempt to parse JSON, fall back to text on failure (e.g., HTML proxy error page)
            let parsedBody = null;
            let isJson = false;
            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                try {
                    parsedBody = await response.json();
                    isJson = true;
                } catch (_) {
                    // fall through to text below
                }
            }
            if (!isJson) {
                try {
                    const text = await response.text();
                    parsedBody = text;
                } catch (_) {
                    parsedBody = null;
                }
            }

            if (!response.ok) {
                const msg = isJson ? (parsedBody?.message || 'Request failed') : (typeof parsedBody === 'string' && parsedBody.trim() ? parsedBody : `HTTP ${response.status}`);
                throw new Error(msg);
            }

            const data = isJson ? parsedBody : (() => { throw new Error('Invalid response from server'); })();

            if (data.message && typeof data.message === 'string' && data.message.includes('not found')) {
                setError(data.message);
                setMovie(null);
            } else {
                setMovie(data);
                setError(null);
            }
        } catch (err) {
            console.error('Fetch Error:', err.message);
            setError(`Connection Error: Could not connect to API or the movie was not found. (${err.message})`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app">
            <header className="header">
                <h1 className="title">
                    <Globe className="icon-lg"/>
                    <span>Mflix Data Explorer</span>
                </h1>
                <p className="subtitle">Search the MongoDB `sample_mflix` dataset via Express/Node.js</p>
            </header>

            <form onSubmit={handleSearch} className="search">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="E.g., Casablanca, Titanic, The Matrix..."
                    className="search-input"
                    disabled={loading}
                />
                <button type="submit" className="search-btn" disabled={loading}>
                    {loading ? 'Searching…' : (<><Search className="icon-sm"/> Search</>)}
                </button>
            </form>

            <div className="content">
                {loading && (
                    <div className="loading">
                        <svg className="spinner" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="30"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
                        <span>Searching database…</span>
                    </div>
                )}

                {error && (
                    <div className="alert error">
                        <XCircle className="icon-sm" />
                        <span>{error}</span>
                    </div>
                )}

                {!loading && !error && !movie && (
                    <div className="placeholder">Start your search to display movie details here!</div>
                )}

                {movie && <MovieCard movie={movie} />}
            </div>
        </div>
    );
}

export default App;
