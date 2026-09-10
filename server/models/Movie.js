import mongoose from 'mongoose';

// Schema mirrors the fields available in MongoDB's sample_mflix.movies collection.
// Everything is optional except title because real documents in that dataset are inconsistent.
const MovieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    plot: { type: String },
    fullplot: { type: String },
    genres: { type: [String], default: [] },
    runtime: { type: Number },
    poster: { type: String },
    year: { type: Number },
    released: { type: Date },
    rated: { type: String },
    cast: { type: [String], default: [] },
    directors: { type: [String], default: [] },
    writers: { type: [String], default: [] },
    countries: { type: [String], default: [] },
    languages: { type: [String], default: [] },
    awards: {
        wins: { type: Number },
        nominations: { type: Number },
        text: { type: String },
    },
    imdb: {
        rating: { type: Number },
        votes: { type: Number },
        id: { type: Number },
    },
    tomatoes: {
        viewer: {
            rating: { type: Number },
            numReviews: { type: Number },
        },
    },
}, {
    // Use the existing 'movies' collection in sample_mflix without pluralizing.
    collection: 'movies'
});

// Speed up the two things we filter/sort by most.
MovieSchema.index({ title: 'text', plot: 'text' });
MovieSchema.index({ 'imdb.rating': -1 });

const Movie = mongoose.model('Movie', MovieSchema);

export default Movie;
