import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import movieRoutes from './routes/movieRoutes.js';

// Load environment variables from .env
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'sample_mflix';

// ============================================================
// CORS CONFIGURATION
// ============================================================

const ALLOWED_ORIGINS = [
    // Main Vercel production domain
    'https://mern-movie-app-umber.vercel.app',

    // Current Vercel deployment domain
    'https://mern-movie-p1mn32frv-aryans-projects-7bc460bb.vercel.app',

    // Vercel Git/branch deployment
    'https://mern-movie-app-git-master-aryans-projects-7bc460bb.vercel.app',

    // Local development
    'http://localhost:5173',

    // Optional React development port
    'http://localhost:3000'
];

// ============================================================
// CHECK MONGODB URI
// ============================================================

if (!MONGODB_URI) {
    console.error('CRITICAL ERROR: MONGODB_URI is not set.');
    process.exit(1);
}

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(
    cors({
        origin: function (origin, callback) {

            // Allow requests without an Origin header
            if (!origin) {
                return callback(null, true);
            }

            // Allow approved frontend origins
            if (ALLOWED_ORIGINS.includes(origin)) {
                return callback(null, true);
            }

            // Block unknown origins
            console.log(`CORS blocked request from origin: ${origin}`);

            return callback(new Error('Not allowed by CORS'));
        },

        methods: [
            'GET',
            'POST',
            'PUT',
            'DELETE',
            'PATCH',
            'OPTIONS'
        ],

        allowedHeaders: [
            'Content-Type',
            'Authorization'
        ],

        credentials: true
    })
);

// Parse JSON request bodies
app.use(express.json());

// ============================================================
// HEALTH CHECK
// ============================================================

app.get('/api/health', async (_req, res) => {

    const state = mongoose.connection.readyState;

    // 1 = connected
    const healthy = state === 1;

    res.status(healthy ? 200 : 503).json({
        status: healthy ? 'ok' : 'degraded',
        dbConnected: healthy,
        dbName: MONGODB_DB
    });
});

// ============================================================
// API ROUTES
// ============================================================

app.use('/api', movieRoutes);

// ============================================================
// 404 FALLBACK
// ============================================================

app.use((_req, res) => {
    res.status(404).json({
        message: 'Route not found on this server.'
    });
});

// ============================================================
// MONGODB CONNECTION
// ============================================================

mongoose
    .connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        dbName: MONGODB_DB
    })
    .then(() => {

        console.log(
            `MongoDB connection successful (db: ${MONGODB_DB})!`
        );

        // ====================================================
        // START SERVER
        // ====================================================

        app.listen(PORT, () => {
            console.log(
                `Movie API Server running on port ${PORT}`
            );

            console.log('Ready to handle requests.');
        });

    })
    .catch((err) => {

        console.error(
            'MongoDB connection error. Exiting process:',
            err
        );

        process.exit(1);
    });