import mongoose from 'mongoose';

// Define the schema for the 'movies' collection
const MovieSchema = new mongoose.Schema({
    plot: { type: String },
    genres: { type: [String] },
    runtime: { type: Number },
    title: { type: String, required: true },
    poster: { type: String },
    released: { type: Date },
    // Include other fields from the sample_mflix collection as needed
}, {
    // This setting tells Mongoose to use the existing 'movies' collection 
    // in the MongoDB database without trying to pluralize the name.
    collection: 'movies'
});

// Create and export the Mongoose model
const Movie = mongoose.model('Movie', MovieSchema);

export default Movie;
