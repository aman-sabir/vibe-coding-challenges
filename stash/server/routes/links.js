const express = require('express');
const router = express.Router();
const db = require('../db');
const { scrapeContent } = require('../services/scraper');
const { summarizeContent } = require('../services/ai');

// Middleware to check if user is logged in
const requireLogin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).send({ error: 'You must log in!' });
    }
    next();
};

// GET /api/links - List user's links
router.get('/', requireLogin, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM links WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
        res.send(result.rows);
    } catch (err) {
        res.status(500).send({ error: 'Database error' });
    }
});

// POST /api/links - Add new link
router.post('/', requireLogin, async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).send({ error: 'URL is required' });

    try {
        // 1. Scrape content
        const { title, content } = await scrapeContent(url);

        // 2. Generate Summary & Tags (AI)
        const { summary, tags } = await summarizeContent(title, content);

        // 3. Save to DB
        const result = await db.query(
            'INSERT INTO links (user_id, url, title, summary, tags) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [req.user.id, url, title, summary, tags]
        );

        res.send(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Processing failed', details: err.message });
    }
});

// DELETE /api/links/:id - Delete link
router.delete('/:id', requireLogin, async (req, res) => {
    try {
        await db.query('DELETE FROM links WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
        res.send({ success: true });
    } catch (err) {
        res.status(500).send({ error: 'Database error' });
    }
});

module.exports = router;
