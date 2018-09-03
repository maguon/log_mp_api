const nodemailer = require('nodemailer');
const sysConfig = require('../../../config/SystemConfig');
const mailTemplate = require('./MailTemplate.js');
const systemConfig = require('../../../config/SystemConfig.js');
const accountTransport = nodemailer.createTransport({
    host: sysConfig.accountMailConfig.host,//官网服务
    port: systemConfig.accountMailConfig.port,//端口
    secureConnection: systemConfig.accountMailConfig.secureConnection,//secure: false,
    auth: {
        user: systemConfig.accountMailConfig.mail,//mail user
        pass: systemConfig.accountMailConfig.password//mail pass
    }
});
module.exports = {
    accountTransport
};
