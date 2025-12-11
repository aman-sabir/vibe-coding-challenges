const router = require('express').Router();
const db = require('../db');

// Middleware to require login
const requireLogin = (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'You must log in!' });
    next();
};

router.use(requireLogin);

const generateId = () => Math.random().toString(36).substr(2, 9);

// Get All Todos
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at ASC', [req.user.id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create Todo
router.post('/', async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'text required' });

    const newId = generateId();
    try {
        const result = await db.query(
            'INSERT INTO todos (id, user_id, text, completed) VALUES ($1, $2, $3, $4) RETURNING *',
            [newId, req.user.id, text, false]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Toggle Todo
router.patch('/:id', async (req, res) => {
    const { completed } = req.body;
    if (completed === undefined) return res.status(400).json({ error: 'completed status required' });

    try {
        const result = await db.query(
            'UPDATE todos SET completed = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            [completed, req.params.id, req.user.id]
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'Todo not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete Todo
router.delete('/:id', async (req, res) => {
    try {
        const result = await db.query('DELETE FROM todos WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'Todo not found' });
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
