const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../db');

module.exports = (app) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
            done(null, result.rows[0]);
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

    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/' }),
        (req, res) => {
            // Redirect to unified frontend home
            res.redirect('http://localhost:5173/');
        }
    );

    app.get('/auth/logout', (req, res, next) => {
        req.logout((err) => {
            if (err) return next(err);
            res.redirect('http://localhost:5173/');
        });
    });

    app.get('/auth/current_user', (req, res) => {
        res.send(req.user);
    });
};
