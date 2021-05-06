'use strict';


const fs = require('fs');
const nodemailer = require('nodemailer');
const path = require('path');

const filePath = path.join(__dirname, '../', 'userskills.json');
const filePathCSV = path.join(__dirname, '../', 'userskills.csv');

const transporter = nodemailer.createTransport({
    host: process.env.SENDMAIL_HOST,
    port: process.env.SENDMAIL_PORT,
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: process.env.SENDMAIL_USER,
        pass: process.env.SENDMAIL_TOKEN
    }
});

let sendEmail = {}

sendEmail.send = function(username, csvFilePath) {
    let message = {
        from: "datacardsignup@endless-endeavors.theswc.net",
        to: process.env.SENDMAIL_RECIPIENT,
        subject: "New user added to csv",
        text: `User ${username} has signed up`,
        attachments: [
            {
                filename: "userskills.csv",
                path: csvFilePath
            }
        ]
    }
    transporter
        .sendMail(message)
        .then(response => {
            console.log("Message sent: %s", response.messageId)
        })
        .catch(err => {
            console.log(err);
        });
}

module.exports = sendEmail