# MERN Movie App

A full-stack movie search application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- 🔍 Live search-as-you-type (debounced) across movie titles
- 🎛️ Filter by genre, decade, and sort by rating / newest / oldest / title
- 🖼️ Responsive movie grid with posters, ratings, and genre chips
- 🎬 Detail view with full plot, cast, director, country, and awards
- ❤️ Personal watchlist saved to the browser (localStorage), no login needed
- ⭐ "Featured picks" homepage powered by a random high-rated sample
- 📄 Pagination for browsing/search results
- 💀 Skeleton loading states instead of blank screens
- 📱 Fully responsive, mobile-friendly layout

## Tech Stack

### Frontend
- React 18
- Vite
- Modern CSS

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS enabled

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd MERN_Movie_App
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   MONGODB_DB=sample_mflix
   PORT=5001
   ```

4. **Start the development servers**
   
   **Terminal 1 - Backend:**
   ```bash
   cd server
   npm start
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   cd client
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5001

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/movies?title=&genre=&year=&sort=&page=&limit=` - Paginated movie search/browse with filters
  - `year` is a decade start, e.g. `1990` matches 1990–1999
  - `sort` is one of `relevance` (rating), `newest`, `oldest`, `title`
- `GET /api/movies/featured?limit=12` - A random sample of highly-rated movies (used on the homepage)
- `GET /api/movies/genres` - Distinct list of genres, for building filter UI
- `GET /api/movies/:id` - Full detail for a single movie
- `GET /api/movies/search?title={movieTitle}` - Legacy single-result search (kept for backwards compatibility)

## Project Structure

```
MERN_Movie_App/
├── client/                 # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── server/                 # Express backend
│   ├── movie_server.js
│   ├── .env
│   └── package.json
├── .gitignore
└── README.md
```

## Deployment

### Frontend (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

### Backend (Railway/Render)
1. Connect your GitHub repository
2. Set start command: `npm start`
3. Add environment variables
4. Deploy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

