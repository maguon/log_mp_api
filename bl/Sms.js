'use strict';
let sysMsg = require('../util/SystemMsg.js');
let sysError = require('../util/SystemError.js');
let oauthUtil = require('../util/OAuthUtil.js');
let encrypt = require('../util/Encrypt.js');
let resUtil = require('../util/ResponseUtil.js');
let listOfValue = require('../util/ListOfValue.js');
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
                logger.error(' queryUser ' + error.message);
                reject(error);
            }else if(rows && rows.length > 0){
                logger.warn('queryUser'+'手机已经被绑定');
                resUtil.resetFailedRes(res,'手机已经被绑定',null);
            }else{
                logger.info('queryUser'+'success');
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            oauthUtil.saveUserPhoneCode({phone:params.phone,code:captcha},(error,result)=>{
                if(error){
                    logger.error(' saveUserPhoneCode ' + error.message);
                    reject(error);
                }else{
                    logger.info('saveUserPhoneCode' + 'success');
                    resolve();
                }
            })
        }).then(()=>{
            new Promise((resolve,reject)=>{
                params.captcha = captcha;
                params.userType = 1;
                oauthUtil.sendCaptcha(params,(error,result)=>{
                    if(error){
                        logger.error(' sendCaptcha ' + error.message);
                        reject(error);
                    }else{
                        logger.info('sendCaptcha' + 'success');
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