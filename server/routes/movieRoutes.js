import express from 'express';
// Import the Movie model from the server/models directory
import Movie from '../models/Movie.js'; 

const router = express.Router();

// Example route - API health check (different from /api/health in movie_server.js)
router.get('/', (req, res) => {
    // This route is called via /api
    res.json({ message: 'Movie API running successfully. Add /movies or other endpoints.' });
});

router.get('/movies', (req, res) => {
    // This route is called via /api/movies
    res.json({ message: 'Movies endpoint - currently returning placeholder data.' });
});

// ***************************************************************
// IMPLEMENTATION: The /movies/search route to query MongoDB
// ***************************************************************
router.get('/movies/search', async (req, res) => {
    const { title } = req.query;
    
    if (!title) {
        return res.status(400).json({ message: "Search query 'title' is required." });
    }

    try {
        // Perform a case-insensitive search on the 'title' field using a regular expression.
        const movies = await Movie.find(
            { title: new RegExp(title, 'i') }, 
            // Projection: Only select the fields needed for the frontend display
            { title: 1, plot: 1, runtime: 1, poster: 1, released: 1, genres: 1 }
        ).limit(1); // Limiting to 1 result for simplicity, as suggested by the UI screenshot

        // Check if any movies were found
        if (movies.length === 0) {
            // Returning a 404 (Not Found) message when the query is empty
            return res.status(404).json({ message: `No movie found matching title: "${title}"` });
        }

        // Return the first found movie data (as the UI suggests displaying one item)
        res.status(200).json(movies[0]);

    } catch (error) {
        // Log the error and return a generic 500 status
        console.error("Database search error:", error);
        res.status(500).json({ message: "An error occurred during movie search." });
    }
});


// Add more routes as needed
// router.get('/movies/:id', ...)
// router.post('/movies', ...)

export default router;
