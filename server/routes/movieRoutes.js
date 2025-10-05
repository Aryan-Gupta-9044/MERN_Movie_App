import express from 'express';
// Assuming you have a Movie model defined somewhere:
// CRITICAL FIX LOCATION: If your model is in '../models/Movie.js' (up one folder) 
// but you accidentally put './routes/' here, it creates the double-path error.
import Movie from '../models/Movie.js'; 

const router = express.Router();

// Route to get all movies
router.get('/movies', async (req, res) => {
    try {
        const movies = await Movie.find({});
        res.status(200).json(movies);
    } catch (error) {
        console.error("Error fetching movies:", error);
        res.status(500).json({ message: "Failed to fetch movies" });
    }
});

// Add more routes (get by ID, post, put, delete) here...

export default router;
