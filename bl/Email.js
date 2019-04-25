'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('Email.js');
const mailConnection = require('../db/connection/mail/MailConnection.js');
const emailHistoryDao = require('../dao/EmailHistoryDAO.js');
const mailTemplate = require('../db/connection/mail/MailTemplate.js');
const sysConfig = require('../config/SystemConfig')

const queryMailRecord = (req,res,next) => {
     let params = req.params;
    emailHistoryDao.queryMailRecord(params,(error,result)=>{
        if(error){
            logger.error('queryMailRecord ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('queryMailRecord ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const sendAccountConfirmEmail = (req,res,next) => {
    let params = req.params;
    let mailOptions = {
        from: sysConfig.accountMailConfig.mail,
        to: params.email,
        subject: sysConfig.accountMailConfig.name,
        text: sysConfig.accountMailConfig.name,
        html: mailTemplate.processTemplate(mailTemplate.accountWelcomeTemplate.html)
    };
    const sendMail = ()=>{
        return new Promise((resolve,reject)=>{
            mailConnection.accountTransport.sendMail(mailOptions,(error,info)=>{
                //console.log(info.messageId);
                if (error) {
                    //添加邮件发送失败记录
                    params.status = 0;
                    resolve(params);
                }else{
                    //添加邮件发送成功记录
                    params.status = 1;
                    resolve(params);
                }
            })
        });
    }
    const addMailRecord = (mailRec)=>{
        return new Promise((resolve,reject)=>{
            emailHistoryDao.addMailRecord(mailRec,(error,result)=>{
                if(error){
                    logger.error('sendAccountConfirmEmail addMailRecord ' + error.message);
                    reject(error.message);
                }else{
                    logger.info('sendAccountConfirmEmail addMailRecord '  + mailRec.email);
                    if(mailRec.status == 1){
                        resUtil.resetCreateRes(res,result,null);
                        return next();
                    }
                }
            });
            if(mailRec.status == 0){
                throw sysError.InternalError(error.message,sysError.InternalError);
                return next();
            }
        });
    }
    sendMail()
        .then(addMailRecord)
        .catch((reject)=>{
            if(reject){
                resUtil.resInternalError(reject,res,next);
            }
        })

    /*
    //=====================================================
    mailConnection.accountTransport.sendMail(mailOptions,(error,info)=>{
        console.log(info.messageId);
        if (error) {
            logger.error('sendAccountConfirmEmail ' + error.message);
            //添加邮件发送失败记录
            params.status = 0;
            emailHistoryDao.addMailRecord(params,(error,result)=>{
                if(error){
                    logger.error('sendAccountConfirmEmail addMailRecord ' + error.message);
                }else{
                    logger.info('sendAccountConfirmEmail addMailRecord '  + params.email);
                }
            });
            throw sysError.InternalError(error.message,sysError.InternalError);
        }else{
            logger.info('sendAccountConfirmEmail '  + params.email);
            //添加邮件发送成功记录
            params.status = 1;
            emailHistoryDao.addMailRecord(params,(error,result)=>{
                if(error){
                    logger.error('sendAccountConfirmEmail addMailRecord ' + error.message);
                }else{
                    logger.info('sendAccountConfirmEmail addMailRecord '  + params.email);
                    resUtil.resetCreateRes(res,result,null);
                }
            });
        }
        return next();
    });
*/
}
module.exports = {
    sendAccountConfirmEmail,
    queryMailRecord
};