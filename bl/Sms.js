'use strict';
let oauthUtil = require('../util/OAuthUtil.js');
let encrypt = require('../util/Encrypt.js');
let resUtil = require('../util/ResponseUtil.js');
let serverLogger = require('../util/ServerLogger.js');
let logger = serverLogger.createLogger('Sms.js');
let userDAO = require('../dao/UserDAO.js');

const sendUserSms=(req,res,next)=>{
    let params = req.params;
    let captcha = "";
    captcha = encrypt.getSmsRandomKey();
    new Promise((resolve,reject)=>{
        userDAO.queryUser({phone:params.phone},(error,rows)=>{
            if(error){
                logger.error('sendUserSms queryUser ' + error.message);
                reject(error);
            }else if(rows && rows.length > 0){
                logger.warn('sendUserSms queryUser '+'The phone is already tied!');
                resUtil.resetFailedRes(res,'手机已经被绑定',null);
            }else{
                logger.info('sendUserSms queryUser '+'success');
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            oauthUtil.saveUserPhoneCode({phone:params.phone,code:captcha},(error,result)=>{
                if(error){
                    logger.error('sendUserSms saveUserPhoneCode ' + error.message);
                    reject(error);
                }else{
                    logger.info('sendUserSms saveUserPhoneCode ' + 'success');
                    resolve();
                }
            })
        }).then(()=>{
            new Promise((resolve,reject)=>{
                params.captcha = captcha;
                params.userType = 1;
                oauthUtil.sendCaptcha(params,(error,result)=>{
                    if(error){
                        logger.error('sendUserSms sendCaptcha ' + error.message);
                        reject(error);
                    }else{
                        logger.info('sendUserSms sendCaptcha ' + 'success');
                        resUtil.resetQueryRes(res,{success:true},null);
                        return next();
                    }
                })
            })
        })
    }).catch((error)=>{
        resUtil.resInternalError(error, res, next);
    })
}
module.exports={
    sendUserSms
}