const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cookieSession = require('cookie-session');
const fs = require('fs');
const path = require('path');
const db = require('./db');

require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(bodyParser.json());

app.use(cookieSession({
    name: 'session',
    keys: [process.env.COOKIE_KEY || 'checkmate_secret_key'],
    maxAge: 24 * 60 * 60 * 1000
}));

// Shim for passport compatibility
app.use((req, res, next) => {
    if (req.session && !req.session.regenerate) {
        req.session.regenerate = (cb) => { cb(); };
    }
    if (req.session && !req.session.save) {
        req.session.save = (cb) => { cb(); };
    }
    next();
});

app.use(passport.initialize());
app.use(passport.session());

// Passport Config
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            done(null, result.rows[0]);
        } else {
            done(null, null);
        }
    } catch (err) {
        done(err, null);
    }
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
            proxy: true
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const existingUser = await db.query('SELECT * FROM users WHERE google_id = $1', [profile.id]);
                if (existingUser.rows.length > 0) {
                    return done(null, existingUser.rows[0]);
                }
                const newUser = await db.query(
                    'INSERT INTO users (google_id, email, name, avatar) VALUES ($1, $2, $3, $4) RETURNING *',
                    [profile.id, profile.emails[0].value, profile.displayName, profile.photos[0].value]
                );
                done(null, newUser.rows[0]);
            } catch (err) {
                console.error('Error in Google Strategy:', err);
                done(err, null);
            }
        }
    )
);

// Auth Middleware
const requireLogin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'You must log in!' });
    }
    next();
};

// Routes

// Auth
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Redirect to frontend home
        res.redirect('http://localhost:5174/');
    }
);

app.get('/auth/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('http://localhost:5174/');
    });
});

app.get('/auth/current_user', (req, res) => {
    res.send(req.user);
});

// Resources (Todos)
const generateId = () => Math.random().toString(36).substr(2, 9);

app.get('/todos', requireLogin, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at ASC', [req.user.id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/todos', requireLogin, async (req, res) => {
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

app.delete('/todos/:id', requireLogin, async (req, res) => {
    try {
        const result = await db.query('DELETE FROM todos WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'Todo not found' });
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.patch('/todos/:id', requireLogin, async (req, res) => {
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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
