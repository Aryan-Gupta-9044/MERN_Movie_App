import express from 'express';

const router = express.Router();

// NOTE: All model imports were removed because the 'models' directory is not present.
// If you add models later, you must uncomment and correct the import paths.

// Example route - this should now work without crashing, as it has no dependencies.
router.get('/', (req, res) => {
    // This route is called via /api
    res.json({ message: 'Movie API running successfully. Add /movies or other endpoints.' });
});

router.get('/movies', (req, res) => {
    // This route is called via /api/movies
    res.json({ message: 'Movies endpoint - currently returning placeholder data as no database model is loaded.' });
});

// ***************************************************************
// CRITICAL FIX: Add the missing /movies/search route to fix the 404 error.
// The frontend is requesting this route with a 'title' query parameter.
// ***************************************************************
router.get('/movies/search', (req, res) => {
    const { title } = req.query;
    
    // In a real MERN app, you would perform a MongoDB query here:
    // const movies = await Movie.find({ title: new RegExp(title, 'i') });
    
    // For now, return a 200 OK status with a message confirming the search worked.
    console.log(`Received search query for title: "${title}"`);
    res.status(200).json({ 
        message: `Search request for "${title}" received and route is working!`,
        query: title,
        results: [] // Placeholder for movie results
    });
});


// Add more routes as needed
// router.get('/movies/:id', ...)
// router.post('/movies', ...)

export default router;
