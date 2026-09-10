import { Heart, Star } from 'lucide-react';

const FALLBACK_POSTER =
    'https://placehold.co/400x600/1e1b4b/c7d2fe?text=No+Poster';

function MovieCard({ movie, onOpen, isSaved, onToggleSave }) {
    // Safely convert IMDb rating to a number
    const imdbRating = Number(movie.imdb?.rating);

    return (
        <div className="movie-card" onClick={() => onOpen(movie)}>
            <div className="movie-card-poster">
                <img
                    src={movie.poster || FALLBACK_POSTER}
                    alt={`Poster for ${movie.title}`}
                    loading="lazy"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_POSTER;
                    }}
                />

                <button
                    type="button"
                    className={`save-btn ${isSaved ? 'saved' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(movie);
                    }}
                    aria-label={
                        isSaved
                            ? 'Remove from watchlist'
                            : 'Add to watchlist'
                    }
                    title={
                        isSaved
                            ? 'Remove from watchlist'
                            : 'Add to watchlist'
                    }
                >
                    <Heart
                        className="icon-sm"
                        fill={isSaved ? 'currentColor' : 'none'}
                    />
                </button>

                {Number.isFinite(imdbRating) && (
                    <span className="rating-badge">
                        <Star
                            className="icon-xs"
                            fill="currentColor"
                        />
                        {imdbRating.toFixed(1)}
                    </span>
                )}
            </div>

            <div className="movie-card-body">
                <h3
                    className="movie-card-title"
                    title={movie.title}
                >
                    {movie.title}
                </h3>

                <div className="movie-card-meta">
                    <span>{movie.year || '—'}</span>

                    {movie.runtime ? (
                        <span>· {movie.runtime} min</span>
                    ) : null}
                </div>

                {movie.genres && movie.genres.length > 0 && (
                    <div className="movie-card-genres">
                        {movie.genres.slice(0, 2).map((g) => (
                            <span
                                key={g}
                                className="chip chip-sm"
                            >
                                {g}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MovieCard;