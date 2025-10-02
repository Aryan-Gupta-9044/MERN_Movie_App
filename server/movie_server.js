import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import movieRoutes from './routes/movieRoutes.js';

// Load variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001; 
const MONGODB_URI = process.env.MONGODB_URI; 
const MONGODB_DB = process.env.MONGODB_DB || 'sample_mflix';

// Define the origins allowed to access the API (CORS fix)
const ALLOWED_ORIGINS = [
    // This is your live Vercel domain from the last screenshot
    'https://mern-movie-app-umber.vercel.app', 
    'http://localhost:5173' // Also keep local development
];


// --- Database Connection ---
if (!MONGODB_URI) {
    console.error('CRITICAL ERROR: MONGODB_URI is not set.');
    // In production, we should exit if the DB URI is missing
    process.exit(1); 
}

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    dbName: MONGODB_DB,
})
    .then(() => {
        console.log(`MongoDB connection successful (db: ${MONGODB_DB})!`);
        
        // *************************************************************
        // *** CRITICAL FIX: Start the server ONLY after the DB connects ***
        // *************************************************************
        app.listen(PORT, () => {
            console.log(`Movie API Server running on port ${PORT}`);
            console.log(`Ready to handle requests.`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error. Exiting process:', err);
        // Crash the application if connection fails, preventing Bad Gateway
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

// Health endpoint
app.get('/api/health', async (_req, res) => {
    const state = mongoose.connection.readyState; // 1 = connected
    const healthy = state === 1;
    res.status(healthy ? 200 : 503).json({
        status: healthy ? 'ok' : 'degraded',
        dbConnected: healthy,
        dbName: MONGODB_DB,
    });
});

// Mount API routes
app.use('/api', movieRoutes);
// *******************************************************************
// *** The app.listen() call has been moved inside mongoose.connect.***
// *******************************************************************
