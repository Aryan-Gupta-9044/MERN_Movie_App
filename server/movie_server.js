import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
// CRITICAL FIX: The path must be relative to the server script's execution context.
// Assuming movie_server.js is at server/movie_server.js and the router is at server/routes/movieRoutes.js
import movieRoutes from './routes/movieRoutes.js'; 

// Load variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001; 
const MONGODB_URI = process.env.MONGODB_URI; 
const MONGODB_DB = process.env.MONGODB_DB || 'sample_mflix';

// Define the origins allowed to access the API (CORS fix)
const ALLOWED_ORIGINS = [
    // This is your main Vercel domain
    'https://mern-movie-app-umber.vercel.app', 
    // CRITICAL FIX: Added the Vercel preview/branch domain to prevent CORS blocks during testing
    'https://mern-movie-app-git-master-aryans-projects-7bc460bb.vercel.app',
    'http://localhost:5173' // Also keep local development
];

// --- Database Connection ---
if (!MONGODB_URI) {
    console.error('CRITICAL ERROR: MONGODB_URI is not set.');
    process.exit(1); 
}

// Connect to MongoDB and start the server only upon success
mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    dbName: MONGODB_DB,
})
    .then(() => {
        console.log(`MongoDB connection successful (db: ${MONGODB_DB})!`);
        
        // *************************************************************
        // *** Start the server ONLY after the DB connects ***
        // *************************************************************
        app.listen(PORT, () => {
            console.log(`Movie API Server running on port ${PORT}`);
            console.log(`Ready to handle requests.`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error. Exiting process:', err);
        process.exit(1); 
    });


// --- Middleware and API Routes ---

// Configure CORS to only allow the Vercel and local domains
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            console.log(`CORS blocked request from origin: ${origin}`);
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true
}));

app.use(express.json());

// Health endpoint (This should be working)
app.get('/api/health', async (_req, res) => {
    const state = mongoose.connection.readyState; // 1 = connected
    const healthy = state === 1;
    res.status(healthy ? 200 : 503).json({
        status: healthy ? 'ok' : 'degraded',
        dbConnected: healthy,
        dbName: MONGODB_DB,
    });
});

// *****************************************************************
// *** CRITICAL: Mount API routes at the /api base path. ***
// *****************************************************************
app.use('/api', movieRoutes); 

// Fallback for 404 errors (Must be placed AFTER all valid routes)
app.use((_req, res) => {
    res.status(404).send({ message: "Route not found on this server." });
});


// Note: The app.listen() call is now correctly located inside mongoose.connect.
