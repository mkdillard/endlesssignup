require('dotenv').config(); // load env vars from .env file.
if( ! 'NODE_ENV' in process.env ) {
    process.env.NODE_ENV = 'development';
};

// App level imports
const express = require('express');
const passport = require('./util/passport');
const path = require('path');
const session = require('express-session');


const app = express();
const port = process.env.PORT || 8080;      
   
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    expiration: 24*60*60*1000, // 1 day
    cookie: {
        maxAge: 24*60*60*1000, // 1 day
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// import controllers
const auth = require('./controllers/authentication');
const signUp = require('./controllers/signUp');

const rootPath = function (req, res) {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
};

app.get('/login', auth.passportAuth);

app.get('/oauth2callback', auth.passportAuth);

app.get('/questionaire', function (req, res) {
    return res.sendFile(path.join(__dirname, 'public', 'questions.html'));
});

app.get('/signup', signUp.processSignup);

app.get('/error', function (req, res) {
    return res.sendFile(path.join(__dirname, '../', 'public', 'error.html'));
});

// serve requests for static files that exist in public folder. This endpoint should always be second to last.
app.use(express.static(path.join(__dirname, 'public')));

// passthrough for vue router to enable browser page refresh, etc. This endpoint should always be last.
app.get('/*', rootPath);

// start server listening
app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});
