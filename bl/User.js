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

const updateUser = (req,res,next)=>{
    let params = req.params;
     userDao.updateUser(params,(error,result)=>{
         if(error){
             logger.error('updateUser' + error.message);
             resUtil.resetFailedRes(error,res,next);
         }else{
             logger.info('updateUser' + 'success');
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
                logger.error('updatePassword' + error.message);
                resUtil.resetFailedRes(error,res,next);
            }else if(rows && rows.length < 1){
                logger.warn('updatePassword' + "尚未注册");
                resUtil.resetFailedRes(res,"尚未注册");
                return next();
            }else if(encrypt.encryptByMd5(params.oldPassword) != rows[0].password){
                logger.warn('updatePassword' + "原密码错");
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
                logger.error('updatePassword' + error.message);
                resUtil.resetFailedRes(error,res,next);
            }else{
                logger.info('updatePassword' + 'success');
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
            logger.error('updateStatus' + error.message);
            resUtil.resetFailedRes(error,res,next);
        }else{
            logger.info('updateStatus' + 'success');
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
                logger.error('getUserPhoneCode' + error.message);
                reject(error);
            }else if(rows && rows.result.code !=params.code ){
                logger.warn('getUserPhoneCode' + '验证码错误');
                resUtil.resetFailedRes(res,'验证码错误',null);
            }else{
                logger.info('getUserPhoneCode'+'success');
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            userDao.updatePhone(params,(error,result)=>{
                if(error){
                    logger.error('updatePhone' + error.message);
                    reject();
                }else{
                    logger.info('updatePhone' + 'success');
                    resolve();
                }
            });
        }).then(()=>{
            new Promise((resolve,reject)=>{
                userDao.updateAuthStatus({authStatus:1,authTime:params.myDate,userId:params.userId},(error,result)=>{
                    if(error){
                        logger.error('updateAuthStatus' + error.message);
                        reject();
                    }else{
                        logger.info('updateAuthStatus'+'success');
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
            logger.error('queryUser' + error.message);
            resUtil.resetFailedRes(error,res,next);
        }else{
            logger.info('queryUser' + 'success');
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
                logger.error('queryUser'+error.message);
                reject(error);
            }else if(rows && rows.length < 1){
                logger.info('queryUser'+'该用户不存在');
                params.userName = params.wechatName;
                params.dateId = moment().format("YYYYMMDD");
                userDao.createUser(params,(error,result)=>{
                    if(error){
                        logger.error('createUser' + error.message);
                        resUtil.resetFailedRes(error,res,next);
                    }else if(result && result.insertId < 1){
                        logger.warn('lastLoginOn'+'创建用户失败');
                        result.resetFailedRes(res,'创建用户失败',null);
                    }else{
                        logger.info('create' + 'success');
                        let user = {
                            userId: result.insertId,
                            status: 1
                        }
                        user.accessToken = oAuthUtil.createAccessToken(oAuthUtil.clientType.user,user.userId,user.status);
                        resUtil.resetQueryRes(res,user,null);
                        return next();
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
                    logger.error('lastLoginOn'+error.message);
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
            logger.error('updateUserInfo' + error.message);
            resUtil.resetFailedRes(error,res,next);
        }else{
            logger.info('updateUserInfo' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
};
const wechatBindPhone=(req,res,next)=>{
    let params = req.params;
    let data = encrypt.WXBizDataCrypt(params.appId,params.sessionKey,params.encryptedData,params.iv);
    resUtil.resetQueryRes(res,data,null);
    return next;
};
module.exports ={
    queryUser,
    userLogin,
    updateUser,
    updatePassword,
    updateStatus,
    updatePhone,
    updateUserInfo,
    wechatBindPhone
};