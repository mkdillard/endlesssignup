'use strict';

const csvjson = require('csvjson');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../', 'userskills.json');
const filePathCSV = path.join(__dirname, '../', 'userskills.csv');

let skillFile = {}

skillFile.read = function() {
    if( !fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([], null, 4), (err) => {
            if (err) {
                console.log(`Error writing to file ${filePath}`);
            }
        });
        
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

skillFile.save = function(userSkills) {
    let users = skillFile.read();

    let userExists = users.some(user => {
        return user.name === userSkills.name;
    });
    if ( userExists ) {
        users.forEach(user => {
            if (user.name === userSkills.name) {
                user.skills = userSkills.skills;
            }
        });
    } else {
        users.push(userSkills);
    }
    fs.writeFileSync(filePath, JSON.stringify(users, null, 4), (err) => {
        if (err) {
            console.log(`Error writing to file ${filePath}`);
        }
    });
}


skillFile.csv = function() {
    let users = skillFile.read();
    let csvUsers = users.map(user => {
        let newUser = {name: user.name, ...user.skills}
        return newUser
    });
    let options = {
        delimiter : ',',
        headers : "relative",
        wrap: false
    }
    let csvString = csvjson.toCSV(csvUsers, options);
    console.log(csvString);
    fs.writeFileSync(filePathCSV, csvString, (err) => {
        if (err) {
            console.log(`Error writing to file ${filePath}`);
        }
    });
}

module.exports = skillFile