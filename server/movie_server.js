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

// --- Middleware and API Routes ---

// Configure CORS to only allow the Vercel and local domains
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            // Optional logging if a blocked request comes through
            console.log(`CORS blocked request from origin: ${origin}`);
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Best practice to explicitly allow methods
    credentials: true // Set to true if authorization headers or cookies are used
}));

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

// Mount API routes
app.use('/api', movieRoutes);

// --- Start the server ---
app.listen(PORT, () => {
    console.log(`Movie API Server running on port ${PORT}`);
});
