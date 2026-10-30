const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Explicitly serve favicon.png to ensure clean browser delivery
app.get('/favicon.png', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'favicon.png'));
});

// 1. Fetch Trending Movies
app.get('/api/movies/trending', async (req, res) => {
    try {
        const apiKey = process.env.TMDB_API_KEY;
        if (!apiKey) return res.status(500).json({ error: 'TMDB_API_KEY is not defined in .env' });

        const response = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`);
        if (!response.ok) throw new Error(`TMDb status: ${response.status}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching trending movies:', error.message);
        res.status(500).json({ error: 'Failed to fetch trending movies' });
    }
});

// 2. Fetch Genre List
app.get('/api/genres', async (req, res) => {
    try {
        const apiKey = process.env.TMDB_API_KEY;
        const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`);
        if (!response.ok) throw new Error(`TMDb genre status: ${response.status}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching genres:', error.message);
        res.status(500).json({ error: 'Failed to fetch genres' });
    }
});

// 3. Discover/Filter Movies by Genre
app.get('/api/movies/genre/:id', async (req, res) => {
    const genreId = req.params.id;
    try {
        const apiKey = process.env.TMDB_API_KEY;
        const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&sort_by=popularity.desc`
        );
        if (!response.ok) throw new Error(`TMDb discover status: ${response.status}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(`Error fetching genre ${genreId}:`, error.message);
        res.status(500).json({ error: 'Failed to fetch movies by genre' });
    }
});

// 4. Search Movies
app.get('/api/movies/search', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: 'Query parameter "q" is required' });

    try {
        const apiKey = process.env.TMDB_API_KEY;
        const response = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`
        );
        if (!response.ok) throw new Error(`TMDb search status: ${response.status}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error searching movies:', error.message);
        res.status(500).json({ error: 'Failed to execute search query' });
    }
});

// 5. Movie Details
app.get('/api/movies/:id', async (req, res) => {
    const movieId = req.params.id;
    try {
        const apiKey = process.env.TMDB_API_KEY;
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`);
        if (!response.ok) throw new Error(`TMDb details status: ${response.status}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(`Error fetching details for movie ${movieId}:`, error.message);
        res.status(500).json({ error: 'Failed to fetch movie details' });
    }
});

// 6. Watch Providers (Where to Watch)
app.get('/api/movies/:id/providers', async (req, res) => {
    const movieId = req.params.id;
    try {
        const apiKey = process.env.TMDB_API_KEY;
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${apiKey}`);
        if (!response.ok) throw new Error(`TMDb providers status: ${response.status}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(`Error fetching watch providers for movie ${movieId}:`, error.message);
        res.status(500).json({ error: 'Failed to fetch watch providers' });
    }
});

app.listen(PORT, () => {
    console.log(`🎬 Reel Finder running live on http://localhost:${PORT}`);
});