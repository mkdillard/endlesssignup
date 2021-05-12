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
    console.log('rootPath')
    console.log(req.url);
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
};

app.get('/showdownsignup/login', auth.passportAuth);

app.get('/showdownsignup/oauth2callback', auth.passportAuth);

app.get('/showdownsignup/signup', signUp.processSignup);

app.get('/showdownsignup/style.css', function (req, res) {
    console.log('css')
    console.log(req.url);
    console.log(path.join(__dirname, 'public', 'style.css'));
    return res.sendFile(path.join(__dirname, 'public', 'style.css'));
});

app.get('/showdownsignup/questionaire', function (req, res) {
    console.log('qs')
    console.log(req.url);
    console.log(path.join(__dirname, 'public', 'questions.html'));
    return res.sendFile(path.join(__dirname, 'public', 'questions.html'));
});

app.get('/showdownsignup/finished', function (req, res) {
    console.log('finished')
    console.log(req.url);
    console.log(path.join(__dirname, 'public', 'finished.html'));
    return res.sendFile(path.join(__dirname, 'public', 'finished.html'));
});

app.get('/showdownsignup/error', function (req, res) {
    console.log('error')
    console.log(req.url);
    console.log(path.join(__dirname, 'public', 'error.html'));
    return res.sendFile(path.join(__dirname, 'public', 'error.html'));
});

// passthrough for vue router to enable browser page refresh, etc. This endpoint should always be last.
app.get('/*', rootPath);

// start server listening
app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});
