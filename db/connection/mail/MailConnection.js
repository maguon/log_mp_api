const nodemailer = require('nodemailer');
const sysConfig = require('../../../config/SystemConfig');
const mailTemplate = require('./template/MailTemplate.js');
const accountTransport = nodemailer.createTransport({
    host: mailTemplate.host163,
    port: mailTemplate.port163,
    //secure: false,
    secureConnection: mailTemplate.secureConnection163,
    auth: {
        user: mailTemplate.user163,
        pass: mailTemplate.pass163
    }
});
module.exports = {
    accountTransport
};
