import express from 'express';
import Movie from '../models/Movie.js';

const router = express.Router();

// Fields sent to the client for grid/list views. Keeping this small keeps
// responses fast — full detail is only fetched when a user opens a movie.
const CARD_FIELDS = 'title plot runtime poster year genres imdb.rating';

router.get('/', (req, res) => {
    res.json({ message: 'Movie API running successfully.' });
});

// GET /api/movies
// Supports: title (text search), genre, year, minRating, sort, page, limit
router.get('/movies', async (req, res) => {
    try {
        const {
            title,
            genre,
            year,
            minRating,
            sort = 'relevance',
            page = 1,
            limit = 12,
        } = req.query;

        const query = {};
        if (title && title.trim()) {
            query.title = new RegExp(title.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        }
        if (genre) {
            query.genres = genre;
        }
        if (year) {
            // `year` is treated as a decade start (e.g. 1990 -> 1990-1999).
            const decadeStart = Number(year);
            query.year = { $gte: decadeStart, $lte: decadeStart + 9 };
        }
        if (minRating) {
            query['imdb.rating'] = { $gte: Number(minRating) };
        }
        // Only show entries that actually have a poster + title so the grid looks good.
        query.poster = { $exists: true, $ne: null };

        const sortMap = {
            relevance: { 'imdb.rating': -1 },
            rating: { 'imdb.rating': -1 },
            newest: { year: -1 },
            oldest: { year: 1 },
            title: { title: 1 },
        };
        const sortBy = sortMap[sort] || sortMap.relevance;

        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
        const skip = (pageNum - 1) * limitNum;

        const [movies, total] = await Promise.all([
            Movie.find(query, CARD_FIELDS).sort(sortBy).skip(skip).limit(limitNum).lean(),
            Movie.countDocuments(query),
        ]);

        res.status(200).json({
            movies,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.max(1, Math.ceil(total / limitNum)),
            },
        });
    } catch (error) {
        console.error('Movie list error:', error);
        res.status(500).json({ message: 'An error occurred while fetching movies.' });
    }
});

// GET /api/movies/featured — a rotating set of well-rated movies for the homepage.
router.get('/movies/featured', async (req, res) => {
    try {
        const limit = Math.min(20, Math.max(1, parseInt(req.query.limit, 10) || 12));
        const movies = await Movie.aggregate([
            { $match: { poster: { $exists: true, $ne: null }, 'imdb.rating': { $gte: 7.5 } } },
            { $sample: { size: limit } },
            { $project: { title: 1, plot: 1, runtime: 1, poster: 1, year: 1, genres: 1, 'imdb.rating': 1 } },
        ]);
        res.status(200).json({ movies });
    } catch (error) {
        console.error('Featured movies error:', error);
        res.status(500).json({ message: 'An error occurred while fetching featured movies.' });
    }
});

// GET /api/movies/genres — distinct genre list, for building the filter dropdown.
router.get('/movies/genres', async (req, res) => {
    try {
        const genres = await Movie.distinct('genres');
        res.status(200).json({ genres: genres.filter(Boolean).sort() });
    } catch (error) {
        console.error('Genres error:', error);
        res.status(500).json({ message: 'An error occurred while fetching genres.' });
    }
});

// GET /api/movies/:id — full detail for the modal/detail view.
router.get('/movies/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id).lean();
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found.' });
        }
        res.status(200).json(movie);
    } catch (error) {
        // Bad ObjectId format falls through here too.
        res.status(404).json({ message: 'Movie not found.' });
    }
});

// Kept for backwards compatibility with the original single-result search endpoint.
router.get('/movies/search', async (req, res) => {
    const { title } = req.query;
    if (!title) {
        return res.status(400).json({ message: "Search query 'title' is required." });
    }
    try {
        const movie = await Movie.findOne(
            { title: new RegExp(title, 'i') },
            CARD_FIELDS
        ).lean();
        if (!movie) {
            return res.status(404).json({ message: `No movie found matching title: "${title}"` });
        }
        res.status(200).json(movie);
    } catch (error) {
        console.error('Database search error:', error);
        res.status(500).json({ message: 'An error occurred during movie search.' });
    }
});

export default router;
