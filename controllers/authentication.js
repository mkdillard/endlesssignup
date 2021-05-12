'use strict';

const passport = require('../util/passport');
const path = require('path');
const sendMail = require('../util/sendemail');
const skillFile = require('../util/skillFile');
const swc_scopes = require('../util/swcScopes');

let authentication = {}
authentication.passportAuth = passport.authenticate('oauth2', { successRedirect: '/showdownsignup/questionaire', failureRedirect: '/showdownsignup/error', scope: swc_scopes.scope });

authentication.logout = (req, res) => {
    req.logout();
    req.session.destroy(() => {
        res.clearCookie('userAuth');
        res.redirect('/');
    });
};

module.exports = authentication;
