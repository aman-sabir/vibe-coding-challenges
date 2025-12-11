const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const express = require('express');
const db = require('../db');
const router = express.Router();

require('dotenv').config();

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
                // Check if user exists
                const existingUser = await db.query('SELECT * FROM users WHERE google_id = $1', [profile.id]);

                if (existingUser.rows.length > 0) {
                    return done(null, existingUser.rows[0]);
                }

                // Create new user
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

// Auth Routes
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication
        // Redirect to frontend dashboard (dev or prod URL)
        // ideally, this URL should be in env too for prod
        res.redirect('http://localhost:5173/dashboard');
    }
);

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('http://localhost:5173/');
});

router.get('/current_user', (req, res) => {
    res.send(req.user);
});

module.exports = router;
