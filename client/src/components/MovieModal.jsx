import { useEffect } from 'react';
import { X, Star, Clock, Calendar, Heart, Globe2, Award } from 'lucide-react';

const FALLBACK_POSTER = 'https://placehold.co/400x600/1e1b4b/c7d2fe?text=No+Poster';

function MovieModal({ movie, loading, onClose, isSaved, onToggleSave }) {
    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
                    <X className="icon-sm" />
                </button>

                {loading || !movie ? (
                    <div className="modal-loading">
                        <div className="spinner-lg" />
                    </div>
                ) : (
                    <div className="modal-content">
                        <div className="modal-poster">
                            <img
                                src={movie.poster || FALLBACK_POSTER}
                                alt={`Poster for ${movie.title}`}
                                onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_POSTER; }}
                            />
                        </div>
                        <div className="modal-details">
                            <h2>{movie.title}</h2>

                            <div className="modal-meta-row">
                                {movie.year && <span className="chip"><Calendar className="icon-xs" /> {movie.year}</span>}
                                {movie.runtime && <span className="chip"><Clock className="icon-xs" /> {movie.runtime} min</span>}
                                {movie.rated && <span className="chip">{movie.rated}</span>}
                                {movie.imdb?.rating != null && (
                                    <span className="chip chip-gold"><Star className="icon-xs" fill="currentColor" /> {movie.imdb.rating.toFixed(1)} IMDb</span>
                                )}
                            </div>

                            {movie.genres && movie.genres.length > 0 && (
                                <div className="modal-genres">
                                    {movie.genres.map((g) => <span key={g} className="chip chip-sm">{g}</span>)}
                                </div>
                            )}

                            <p className="modal-plot">{movie.fullplot || movie.plot || 'No plot summary available.'}</p>

                            <div className="modal-info-grid">
                                {movie.directors && movie.directors.length > 0 && (
                                    <div><strong>Director</strong><span>{movie.directors.join(', ')}</span></div>
                                )}
                                {movie.cast && movie.cast.length > 0 && (
                                    <div><strong>Cast</strong><span>{movie.cast.slice(0, 5).join(', ')}</span></div>
                                )}
                                {movie.countries && movie.countries.length > 0 && (
                                    <div><strong><Globe2 className="icon-xs" /> Country</strong><span>{movie.countries.join(', ')}</span></div>
                                )}
                                {movie.awards?.text && (
                                    <div><strong><Award className="icon-xs" /> Awards</strong><span>{movie.awards.text}</span></div>
                                )}
                            </div>

                            <button
                                type="button"
                                className={`watchlist-toggle-btn ${isSaved ? 'saved' : ''}`}
                                onClick={() => onToggleSave(movie)}
                            >
                                <Heart className="icon-sm" fill={isSaved ? 'currentColor' : 'none'} />
                                {isSaved ? 'In your watchlist' : 'Add to watchlist'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MovieModal;
