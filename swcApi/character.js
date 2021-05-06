'use strict';

const axios = require('axios');
// const parseString = require('xml2js').parseString;


let swcCharacter = {}

swcCharacter.getCharacterInfo = function(accessToken) {
    let axiosOptions = {
        headers: {
            'Accept': 'application/json'

        },
        params: {
            'access_token': accessToken
        }
    }
    let profileUrl = 'https://www.swcombine.com/ws/v2.0/character/';
    return axios.get(profileUrl, axiosOptions)
        .then((response) => {
            let profile = response.data.swcapi.character;
            let char = {
                userid : profile.uid,
                name : profile.name,
                skills : profile.skills
            }
            return Promise.resolve(char);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
}

module.exports = swcCharacter
