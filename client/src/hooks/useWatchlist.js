import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'mflix.watchlist';

function loadWatchlist() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

// Keeps a small "saved for later" list of movies in localStorage,
// keyed by movie _id. Stores just enough data to render a card.
export function useWatchlist() {
    const [watchlist, setWatchlist] = useState(loadWatchlist);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
    }, [watchlist]);

    const isSaved = useCallback(
        (id) => watchlist.some((m) => m._id === id),
        [watchlist]
    );

    const toggle = useCallback((movie) => {
        setWatchlist((prev) => {
            const exists = prev.some((m) => m._id === movie._id);
            if (exists) {
                return prev.filter((m) => m._id !== movie._id);
            }
            return [movie, ...prev];
        });
    }, []);

    return { watchlist, isSaved, toggle };
}
