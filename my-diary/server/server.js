const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(bodyParser.json());

app.use(cookieSession({
    name: 'session',
    keys: [process.env.COOKIE_KEY || 'secret'],
    maxAge: 24 * 60 * 60 * 1000
}));

// Passport Shim
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

// Routes
require('./routes/auth')(app); // Auth routes
app.use('/api/todos', require('./routes/todos'));
app.use('/api/links', require('./routes/links'));

app.listen(PORT, () => {
    console.log(`My-Diary Server running on http://localhost:${PORT}`);
});
