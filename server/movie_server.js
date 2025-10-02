        import express from 'express';
        import cors from 'cors';
        import mongoose from 'mongoose';
        import dotenv from 'dotenv';

        // Load variables from .env file
        dotenv.config();

        const app = express();
        const PORT = process.env.PORT || 5001; 
        const MONGODB_URI = process.env.MONGODB_URI; 
        const MONGODB_DB = process.env.MONGODB_DB || 'sample_mflix';

        // --- Database Connection ---
        if (!MONGODB_URI) {
            console.error('MONGODB_URI is not set. Set it in your .env file.');
        } else {
            mongoose.connect(MONGODB_URI, {
                serverSelectionTimeoutMS: 5000,
                dbName: MONGODB_DB,
            })
                .then(() => console.log(`MongoDB connection successful (db: ${MONGODB_DB})!`))
                .catch(err => {
                    console.error('MongoDB connection error:', err);
                    console.error('CRITICAL: Check your connection string, IP allowlist, and network.');
                });
        }

        // --- Mongoose Schema and Model for Movies ---
        const movieSchema = new mongoose.Schema({
            title: { type: String, required: true },
            plot: String,
            poster: String,
            year: Number,
            genres: [String],
            runtime: Number,
        }, { collection: 'movies' }); 

        const Movie = mongoose.model('Movie', movieSchema);

        // --- Middleware and API Routes ---
        app.use(cors());
        app.use(express.json());

        // Health endpoint
        app.get('/api/health', async (_req, res) => {
            const state = mongoose.connection.readyState; // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
            const healthy = state === 1;
            res.status(healthy ? 200 : 503).json({
                status: healthy ? 'ok' : 'degraded',
                dbConnected: healthy,
                dbName: MONGODB_DB,
            });
        });

        // API: GET movie details by searching for the title (case-insensitive)
        app.get('/api/movies/search', async (req, res) => {
            const { title } = req.query;
            console.log('GET /api/movies/search', { title });

            if (!title || typeof title !== 'string' || !title.trim()) {
                return res.status(400).json({ message: 'Movie title query parameter is required.' });
            }

            if (mongoose.connection.readyState !== 1) {
                return res.status(503).json({ message: 'Database not connected. Please try again later.' });
            }

            // Escape user input to a safe literal regex
            const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            try {
                // Use a case-insensitive regular expression
                const movie = await Movie.findOne({
                    title: { $regex: new RegExp(escapeRegex(title.trim()), 'i') }
                }).lean();

                if (!movie) {
                    return res.status(404).json({ message: `Movie with title containing "${title}" not found.` });
                }

                res.json(movie);
            } catch (err) {
                console.error('Error fetching movie:', err && err.stack ? err.stack : err);
                res.status(500).json({ message: 'Error fetching movie data from database.', error: err?.message || String(err) });
            }
        });

        // --- Start the server ---
        app.listen(PORT, () => {
            console.log(`Movie API Server running on port ${PORT}`);
        });
        
