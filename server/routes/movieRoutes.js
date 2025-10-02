import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  plot: String,
  poster: String,
  year: Number,
  genres: [String],
  runtime: Number,
}, { collection: 'movies' });

const Movie = mongoose.models.Movie || mongoose.model('Movie', movieSchema);

router.get('/movies/search', async (req, res) => {
  const { title } = req.query;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ message: 'Movie title query parameter is required.' });
  }

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'Database not connected. Please try again later.' });
  }

  const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  try {
    const movie = await Movie.findOne({
      title: { $regex: new RegExp(escapeRegex(title.trim()), 'i') }
    }).lean();

    if (!movie) {
      return res.status(404).json({ message: `Movie with title containing "${title}" not found.` });
    }

    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching movie data from database.', error: err?.message || String(err) });
  }
});

export default router;


