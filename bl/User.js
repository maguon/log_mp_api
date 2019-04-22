'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('User.js');
const userDao = require('../dao/UserDAO.js');
const encrypt = require('../util/Encrypt.js');
const moment = require('moment/moment.js');
const oAuthUtil = require('../util/OAuthUtil.js');
const sysConfig = require("../config/SystemConfig");

const updateUser = (req,res,next)=>{
    let params = req.params;
     userDao.updateUser(params,(error,result)=>{
         if(error){
             logger.error('updateUser ' + error.message);
             resUtil.resetFailedRes(error,res,next);
         }else{
             logger.info('updateUser ' + 'success');
             resUtil.resetUpdateRes(res,result,null);
             return next();
         }
     });
};
const updatePassword=(req,res,next)=>{
    let params = req.params;
    new Promise((resolve) => {
        userDao.queryUser(params,(error,rows)=>{
            if(error){
                logger.error('updatePassword queryUser ' + error.message);
                resUtil.resetFailedRes(error,res,next);
            }else if(rows && rows.length < 1){
                logger.warn('updatePassword queryUser ' + "Have not yet registered!");
                resUtil.resetFailedRes(res,"尚未注册");
                return next();
            }else if(encrypt.encryptByMd5(params.oldPassword) != rows[0].password){
                logger.warn('updatePassword queryUser ' + "The original password is wrong!");
                resUtil.resetFailedRes(res,"原密码错误");
                return next();
            }else{
                resolve();
            }
        })
    }).then(() => {
        params.newPassword = encrypt.encryptByMd5(params.newPassword);
        userDao.updatePassword(params,(error,result)=>{
            if(error){
                logger.error('updatePassword ' + error.message);
                resUtil.resetFailedRes(error,res,next);
            }else{
                logger.info('updatePassword ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}
const updateStatus=(req,res,next)=>{
    let params = req.params;
    userDao.updateStatus(params,(error,result)=>{
        if(error){
            logger.error('updateStatus ' + error.message);
            resUtil.resetFailedRes(error,res,next);
        }else{
            logger.info('updateStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
};
const updatePhone=(req,res,next)=>{
    let params = req.params;
    params.myDate = new Date();
    new Promise((resolve,reject)=>{
        oAuthUtil.getUserPhoneCode({phone:params.phone},(error,rows)=>{
            if(error){
                logger.error('updatePhone getUserPhoneCode ' + error.message);
                reject(error);
            }else if(rows && rows.result.code !=params.code ){
                logger.warn('updatePhone getUserPhoneCode ' + 'Verification code error!');
                resUtil.resetFailedRes(res,'验证码错误',null);
            }else{
                logger.info('updatePhone getUserPhoneCode '+'success');
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            userDao.updatePhone(params,(error,result)=>{
                if(error){
                    logger.error('updatePhone ' + error.message);
                    reject();
                }else{
                    logger.info('updatePhone ' + 'success');
                    resolve();
                }
            });
        }).then(()=>{
            new Promise((resolve,reject)=>{
                userDao.updateAuthStatus({authStatus:1,authTime:params.myDate,userId:params.userId},(error,result)=>{
                    if(error){
                        logger.error('updatePhone updateAuthStatus ' + error.message);
                        reject();
                    }else{
                        logger.info('updatePhone updateAuthStatus '+'success');
                        resUtil.resetUpdateRes(res,result,null);
                        return next();
                    }
                })
            })
        })
    }).catch((error)=>{
        resUtil.resInternalError(error,res,next);
    })
};
const queryUser = (req,res,next)=>{
    let params = req.params;
    userDao.queryUser(params,(error,result)=>{
        if(error){
            logger.error('queryUser ' + error.message);
            resUtil.resetFailedRes(error,res,next);
        }else{
            logger.info('queryUser ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
};
const userLogin = (req,res,next)=>{
    let params = req.params;
    let resObj = {};
    let myDate = new Date();
    params.lastLoginOn = myDate;
    new Promise((resolve,reject)=>{
        userDao.queryUser({wechatId:params.wechatId},(error,rows)=>{
            if(error){
                logger.error('userLogin queryUser '+error.message);
                reject(error);
            }else if(rows && rows.length < 1){
                logger.info('userLogin queryUser '+'The user does not exist!');
                params.userName = params.wechatName;
                params.dateId = moment().format("YYYYMMDD");
                userDao.createUser(params,(error,result)=>{
                    if(error){
                        logger.error('userLogin createUser ' + error.message);
                        resUtil.resetFailedRes(error,res,next);
                    }else if(result && result.insertId < 1){
                        logger.warn('userLogin lastLoginOn'+'User creation failed!');
                        result.resetFailedRes(res,'创建用户失败',null);
                    }else{
                        logger.info('create' + 'success');
                        let user = {
                            userId: result.insertId,
                            status: 1
                        }
                        user.accessToken = oAuthUtil.createAccessToken(oAuthUtil.clientType.user,user.userId,user.status);
                        oAuthUtil.saveToken(user,function(error,result){
                            if(error){
                                logger.error('userLogin saveToken ' + error.stack);
                                return next(sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG))
                            }else{
                                logger.info('userLogin saveToken ' +params.userId+ " success");
                                resUtil.resetQueryRes(res,user,null);
                                return next();
                            }
                        })
                        // resUtil.resetQueryRes(res,user,null);
                        // return next();
                    }
                });
            }else{
                resObj = {
                    userId: rows[0].id,
                    userName: rows[0].user_name,
                    status: rows[0].wechat_status,
                    type: rows[0].type
                };
                resObj.accessToken = oAuthUtil.createAccessToken(oAuthUtil.clientType.user,resObj.userId,resObj.status);
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            userDao.lastLoginOn({wechatId:params.wechatId,lastLoginOn:params.lastLoginOn},(error,result)=>{
                if(error){
                    logger.error('userLogin lastLoginOn '+error.message);
                    reject(error);
                }else{
                    resUtil.resetQueryRes(res,resObj,null);
                    return next();
                }
            });
        })
    }).catch((error)=>{
        resUtil.resetFailedRes(error,res,next);
    })
};
const updateUserInfo=(req,res,next)=>{
    let params = req.params;
    userDao.updateUserInfo(params,(error,result)=>{
        if(error){
            logger.error('updateUserInfo ' + error.message);
            resUtil.resetFailedRes(error,res,next);
        }else{
            logger.info('updateUserInfo ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
};
const wechatBindPhone=(req,res,next)=>{
    let params = req.params;
    let appId = sysConfig.wechatConfig.mpAppId;
    let data = encrypt.WXBizDataCrypt(appId,params.sessionKey,params.encryptedData,params.iv);
    if (data.phoneNumber){
        params.phone = data.phoneNumber;
    }
    params.authStatus = 1;
    params.authTime = new Date();
    userDao.updatePhone(params,(error,result)=>{
        if(error){
            logger.error('wechatBindPhone updateUserInfo ' + error.message);
            resUtil.resetFailedRes(error,res,next);
        }else{
            logger.info('wechatBindPhone updateUserInfo ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
};
const updateToken=(req,res,next)=>{
    let params = req.params;
    let user ={
        userId:params.userId
    }
    new Promise((resolve,reject)=>{
        userDao.queryUser(params,(error,rows)=>{
            if(error){
                logger.error('updateToken queryUser ' + error.message);
                resUtil.resetFailedRes(error,res,next);
                reject(error);
            }else{
                logger.info('updateToken queryUser ' + 'success');
                user.status = rows[0].status;
                resolve();
            }
        });
    }).then(()=>{
        user.accessToken = oAuthUtil.createAccessToken(oAuthUtil.clientType.user,user.userId,user.status);
        oAuthUtil.removeToken({accessToken:params.token},function(error,result){
            if(error) {
                logger.error('updateToken removeToken ' + error.stack);
                resUtil.resInternalError(error,res,next);
            }else {
                oAuthUtil.saveToken(user,function(error,result){
                    if(error){
                        logger.error('updateToken removeToken ' + error.stack);
                        return next(sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG))
                    }else{
                        logger.info('updateToken removeToken ' +params.userId+ " success");
                        resUtil.resetQueryRes(res,user,null);
                        return next();
                    }
                })
            }
        })
    })
};
module.exports ={
    queryUser,
    userLogin,
    updateUser,
    updatePassword,
    updateStatus,
    updatePhone,
    updateUserInfo,
    wechatBindPhone,
    updateToken
};