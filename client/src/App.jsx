import { useCallback, useEffect, useState } from 'react';
import { Clapperboard, Compass, Heart, XCircle } from 'lucide-react';
import './App.css';
import { API_ENDPOINTS } from './apiconfig';
import { useDebounce } from './hooks/useDebounce';
import { useWatchlist } from './hooks/useWatchlist';
import FilterBar from './components/FilterBar';
import MovieGrid from './components/MovieGrid';
import MovieModal from './components/MovieModal';
import Pagination from './components/Pagination';

function App() {
    const [tab, setTab] = useState('discover'); // 'discover' | 'watchlist'

    // Discover state
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [genre, setGenre] = useState('');
    const [year, setYear] = useState('');
    const [sort, setSort] = useState('relevance');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const debouncedSearch = useDebounce(searchTerm, 400);
    const { watchlist, isSaved, toggle } = useWatchlist();

    // Modal state
    const [activeMovie, setActiveMovie] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    // Load genre list once.
    useEffect(() => {
        fetch(API_ENDPOINTS.GENRES)
            .then((r) => r.json())
            .then((data) => setGenres(data.genres || []))
            .catch(() => setGenres([]));
    }, []);

    // Reset to page 1 whenever a filter changes.
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, genre, year, sort]);

    // Fetch movies whenever filters or page change (Discover tab only).
    useEffect(() => {
        if (tab !== 'discover') return;
        const controller = new AbortController();
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (debouncedSearch.trim()) params.set('title', debouncedSearch.trim());
        if (genre) params.set('genre', genre);
        if (year) params.set('year', year);
        if (sort) params.set('sort', sort);
        params.set('page', page);
        params.set('limit', 12);

        const url = debouncedSearch.trim() || genre || year
            ? `${API_ENDPOINTS.MOVIES}?${params.toString()}`
            : `${API_ENDPOINTS.FEATURED}?limit=12`;

        fetch(url, { signal: controller.signal })
            .then(async (res) => {
                if (!res.ok) throw new Error(`Server responded with ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setMovies(data.movies || []);
                setTotalPages(data.pagination?.totalPages || 1);
            })
            .catch((err) => {
                if (err.name !== 'AbortError') {
                    console.error('Fetch error:', err);
                    setError('Could not load movies. Please check your connection and try again.');
                    setMovies([]);
                }
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, [tab, debouncedSearch, genre, year, sort, page]);

    const openMovie = useCallback((movie) => {
        setActiveMovie(movie);
        setModalLoading(true);
        fetch(API_ENDPOINTS.MOVIE_DETAIL(movie._id))
            .then((r) => r.json())
            .then((full) => setActiveMovie(full))
            .catch(() => {})
            .finally(() => setModalLoading(false));
    }, []);

    const clearFilters = () => {
        setSearchTerm('');
        setGenre('');
        setYear('');
        setSort('relevance');
    };

    const isBrowsing = tab === 'discover';

    return (
        <div className="app">
            <header className="header">
                <h1 className="title">
                    <Clapperboard className="icon-lg" />
                    <span>Mflix Explorer</span>
                </h1>
                <p className="subtitle">Browse, search and save movies from the sample_mflix dataset</p>

                <nav className="tabs">
                    <button
                        type="button"
                        className={`tab-btn ${tab === 'discover' ? 'active' : ''}`}
                        onClick={() => setTab('discover')}
                    >
                        <Compass className="icon-sm" /> Discover
                    </button>
                    <button
                        type="button"
                        className={`tab-btn ${tab === 'watchlist' ? 'active' : ''}`}
                        onClick={() => setTab('watchlist')}
                    >
                        <Heart className="icon-sm" /> Watchlist
                        {watchlist.length > 0 && <span className="tab-count">{watchlist.length}</span>}
                    </button>
                </nav>
            </header>

            <main className="content">
                {isBrowsing && (
                    <>
                        <FilterBar
                            searchTerm={searchTerm} onSearchChange={setSearchTerm}
                            genre={genre} onGenreChange={setGenre} genres={genres}
                            year={year} onYearChange={setYear}
                            sort={sort} onSortChange={setSort}
                            onClear={clearFilters}
                        />

                        {error && (
                            <div className="alert error">
                                <XCircle className="icon-sm" />
                                <span>{error}</span>
                            </div>
                        )}

                        {!error && !loading && !searchTerm && !genre && !year && (
                            <p className="section-label">Featured picks</p>
                        )}

                        <MovieGrid
                            movies={movies}
                            loading={loading}
                            emptyMessage="No movies matched your search. Try a different title or filter."
                            onOpen={openMovie}
                            isSaved={isSaved}
                            onToggleSave={toggle}
                        />

                        {!loading && !error && <Pagination page={page} totalPages={totalPages} onChange={setPage} />}
                    </>
                )}

                {!isBrowsing && (
                    <MovieGrid
                        movies={watchlist}
                        loading={false}
                        emptyMessage="Your watchlist is empty. Tap the heart on any movie to save it here."
                        onOpen={openMovie}
                        isSaved={isSaved}
                        onToggleSave={toggle}
                    />
                )}
            </main>

            {activeMovie && (
                <MovieModal
                    movie={activeMovie}
                    loading={modalLoading}
                    onClose={() => setActiveMovie(null)}
                    isSaved={isSaved(activeMovie._id)}
                    onToggleSave={toggle}
                />
            )}
        </div>
    );
}

export default App;
