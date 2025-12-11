const router = require('express').Router();
const db = require('../db');
const { scrapeContent } = require('../services/scraper');
const { summarizeContent } = require('../services/ai');

// Middleware to require login
const requireLogin = (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'You must log in!' });
    next();
};

router.use(requireLogin);

// Get All Links
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM links WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create Link
router.post('/', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL required' });

    try {
        // 1. Scrape
        const { title, content } = await scrapeContent(url);

        // 2. AI Summarize
        const { summary, tags } = await summarizeContent(title, content);

        // 3. Save to DB
        const result = await db.query(
            'INSERT INTO links (user_id, url, title, summary, tags) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [req.user.id, url, title, summary, tags]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to process link' });
    }
});

// Delete Link
router.delete('/:id', async (req, res) => {
    try {
        const result = await db.query('DELETE FROM links WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'Link not found' });
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
