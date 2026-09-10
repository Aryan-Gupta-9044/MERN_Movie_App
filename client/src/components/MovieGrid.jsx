import { Film } from 'lucide-react';
import MovieCard from './MovieCard';

function SkeletonCard() {
    return (
        <div className="movie-card skeleton">
            <div className="movie-card-poster skeleton-block" />
            <div className="movie-card-body">
                <div className="skeleton-line skeleton-block" style={{ width: '80%' }} />
                <div className="skeleton-line skeleton-block" style={{ width: '50%' }} />
            </div>
        </div>
    );
}

function MovieGrid({ movies, loading, emptyMessage, onOpen, isSaved, onToggleSave }) {
    if (loading) {
        return (
            <div className="movie-grid">
                {Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        );
    }

    if (!movies || movies.length === 0) {
        return (
            <div className="empty-state">
                <Film className="icon-lg" />
                <p>{emptyMessage || 'No movies to show yet.'}</p>
            </div>
        );
    }

    return (
        <div className="movie-grid">
            {movies.map((movie) => (
                <MovieCard
                    key={movie._id}
                    movie={movie}
                    onOpen={onOpen}
                    isSaved={isSaved(movie._id)}
                    onToggleSave={onToggleSave}
                />
            ))}
        </div>
    );
}

export default MovieGrid;
