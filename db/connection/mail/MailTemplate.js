'use strict';
const serverLogger = require('../../../util/ServerLogger.js');
const logger = serverLogger.createLogger('MailTemplate.js');
let accountWelcomeTemplate  = {
    subject : '欢迎',
    html : '<div><h1>欢迎您userName<img src=accountImg/></h1><a href=url>请点击查看</a><h1>点击可查询订单</h1></div>'
};
const processTemplate = (html) => {
    let params = {
        user: 'Yang',
        url: '"file:///d:\\ws\\log_mp_api\\util\\Text.html"',
        img: '"file:///d:\\ws\\log_mp_api\\public\\docs\\images\\timg.jpg"'
    };
    html = accountWelcomeTemplate.html.replace('userName',params.user).replace('url',params.url).replace('accountImg',params.img);
    return html;
}
module.exports = {
    accountWelcomeTemplate,
    processTemplate
}