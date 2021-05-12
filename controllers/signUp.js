'use strict';

const path = require('path');
const sendMail = require('../util/sendemail');
const skillFile = require('../util/skillFile');

let signUp = {}
signUp.processSignup = (req, res) => {
    let profile = req.session.passport.user.profile
    let userSkillSummary = { "name": profile.name, "maxHP": profile.maxHP, "skills": {}, "questions": {} }
    for ( let k in profile.skills.value) {
        let skills = profile.skills.value[k][0];
        for (let j in skills.skill) {
            let skill = skills.skill[j];
            userSkillSummary.skills[skill.attributes.type] = skill.value;
        }
    }

    add_query_params_to_skills(req.query, userSkillSummary)
        .then((skillSummary) => {
            return Promise.resolve(skillFile.save(skillSummary));
        })
        .then(() => {
            return Promise.resolve(skillFile.csv());
        })
        .then(() => {
            let fileName = path.join(__dirname, '../', 'userskills.csv')
            return Promise.resolve(sendMail.send(userSkillSummary.name, fileName));
        })
        .then(() => {
            return Promise.resolve(res.sendFile(path.join(__dirname, '../', 'public', 'finished.html')));
        })
        .catch((err) => {
            return Promise.resolve(res.sendFile(path.join(__dirname, '../', 'public', 'error.html')));
        });    
};

let add_query_params_to_skills = function(query, skills) {
    for (let q in query) {
        skills['questions'][q] = query[q];
    }

    return Promise.resolve(skills);
}

module.exports = signUp;
