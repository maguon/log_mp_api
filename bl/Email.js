'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('Email.js');
const mailConnection = require('../db/connection/mail/MailConnection.js');
const emailDao = require('../dao/EmailDAO.js');
const mailTemplate = require('../db/connection/mail/template/MailTemplate.js');

const sendAccountConfirmEmail = (req,res,next) => {
    //1.从文件中读取模板转成字符串
    //<div><h1>欢迎%username%</h1></div>
    //2.把变量替换到模板内容中
    //3.把邮箱地址作为变量放到options中，完成发送
    let params = req.params;
    let mailOptions = {
        from: mailTemplate.user163,
        to: params.toUser,//从文件中读取模板转成字符串<div><h1>欢迎%username%</h1></div>
        subject: mailTemplate.subject,
        text: mailTemplate.text,
        //html: '<meta http-equiv="refresh" content="10; 这里加入要跳转的页面的地址 ">'
        //html: '<div><h1>欢迎光临'+'<img src="file:///d:\\ws\\log_mp_api\\public\\docs\\images\\timg.jpg" />'+'<a href="file:///d:\\ws\\log_mp_api\\db\\connection\\mail\\template\\WelcomTemplate.html">'+'</h1><h2>'+params.toUser+'</h2><h3>'+mailTemplate.html+'</h3></div>'
        html: '<div><h1>欢迎光临'+'<img src="file:///d:\\ws\\log_mp_api\\public\\docs\\images\\timg.jpg" /></h1><h2>'+params.toUser+'</h2><a  href="file:///d:\\\\ws\\\\log_mp_api\\\\db\\\\connection\\\\mail\\\\template\\\\WelcomTemplate.html">'+mailTemplate.html+'</a><a>点击查看订单详情</a></div>'
    };
    mailConnection.accountTransport.sendMail(mailOptions,(error,info)=>{
        if (error) {
            return console.log(error);
        }

        emailDao.createMail(mailOptions.from,(error,result)=>{
            if(error){
                logger.error('createMail' + error.message);
                throw sysError.InternalError(error.message,sysError.InternalError);
            }else{
                logger.info('createMail' + 'success');
                resUtil.resetCreateRes(res,result,null);
            }
        });
        console.log('Message sent: %s',info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        return next();
    });
};
module.exports = {
    sendAccountConfirmEmail
};