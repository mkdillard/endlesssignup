'use strict';

const Oauth2Strategy = require('passport-oauth2');
const parseString = require('xml2js').parseString;
const passport = require('passport');
const uuid = require('uuid').v4;

const swcCharacter = require('../swcApi/character');

// Override the token params in the Oauth2Strategy for swc specific provider params.
Oauth2Strategy.prototype.tokenParams = function(options) {
    return {
        access_type: 'online'
    };
};

const strategyOptions = {
    authorizationURL: process.env.OAUTH_AUTH_URL,
    tokenURL: process.env.OAUTH_TOKEN_URL,
    clientID: process.env.APP_ID,
    clientSecret: process.env.APP_SECRET,
    callbackURL: process.env.OAUTH_CALLBACK_URL
};

passport.use(new Oauth2Strategy(strategyOptions, function(accessToken, refreshToken, tokenResponse, profile, done) {
    let newID = uuid();
    let user = {
        sid: newID
    };
    
    parseString(JSON.stringify(tokenResponse).split('\\n')[1], (err, result) => {
        if (err) {
            console.log('XML PARSE ERROR');
            console.log(err);
        }
        let now = new Date();
        let access_token_ttl = parseInt(result.OAuth.expires_in[0], 10);
        user.access_token = result.OAuth.access_token[0];
        user.access_expires = now.setSeconds(now.getSeconds() + access_token_ttl);
        user.scope = result.OAuth.scope;
    });
    swcCharacter.getCharacterInfo(user.access_token)
        .then((profile) => {
            user.profile = profile;
            done(null, user);
        })
        .catch((err) => {
            done(err);
        });
}));

passport.serializeUser((user, done) => {
    let userSession = {
        sid: user.sid,
        profile: user.profile,
        accessToken: user.access_token
    }
    done(null, userSession);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport;
