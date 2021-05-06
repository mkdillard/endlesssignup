'use strict';

const passport = require('../util/passport');
const path = require('path');
const sendMail = require('../util/sendemail');
const skillFile = require('../util/skillFile');
const swc_scopes = require('../util/swcScopes');

let authentication = {}
authentication.passportAuth = passport.authenticate('oauth2', { successRedirect: '/loginSuccess', failureRedirect: '/error', scope: swc_scopes.scope });

authentication.loginSuccess = (req, res) => {
    let profile = req.session.passport.user.profile
    let userSkillSummary = { "name": profile.name, skills: {} }
    for ( let k in profile.skills.value) {
        let skills = profile.skills.value[k][0];
        for (let j in skills.skill) {
            let skill = skills.skill[j];
            userSkillSummary.skills[skill.attributes.type] = skill.value;
        }
    }

    skillFile.save(userSkillSummary);
    skillFile.csv();
    sendMail.send(userSkillSummary.name, path.join(__dirname, '../', 'userskills.csv'));

    res.sendFile(path.join(__dirname, '../', 'public', 'pages', 'finished.html'));
};

authentication.logout = (req, res) => {
    req.logout();
    req.session.destroy(() => {
        res.clearCookie('userAuth');
        res.redirect('/');
    });
};

module.exports = authentication;