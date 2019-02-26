'use strict';

const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const encrypt = require('../util/Encrypt.js');
const resUtil = require('../util/ResponseUtil.js');
const listOfValue = require('../util/ListOfValue.js');
const oAuthUtil = require('../util/OAuthUtil.js');
const adminUserDao = require('../dao/AdminUserDAO.js');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('AdminUser.js');
const sysConsts = require("../util/SystemConst");

const createAdminUser = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject)=>{
        adminUserDao.queryAdminUser({phone:params.phone},(error,rows)=>{
            if (error) {
                logger.error(' queryAdminUser ' + error.message);
                resUtil.resInternalError(error,res,next);
                return next();
            } else {
                if(rows && rows.length>0){
                    logger.warn(' queryAdminUser ' +params.phone+ sysMsg.CUST_SIGNUP_REGISTERED);
                    resUtil.resetFailedRes(res,sysMsg.CUST_SIGNUP_REGISTERED) ;
                    return next();
                }else{
                    resolve();
                }
            }
        })
    }).then(()=>{
        params.password = encrypt.encryptByMd5(params.password);
        adminUserDao.createAdminUser(params,(error,result)=>{
            if (error) {
                logger.error(' createAdminUser ' + error.message);
                resUtil.resInternalError(error,res,next);
            } else {
                if(result && result.insertId>0){
                    logger.info(' createAdminUser ' + 'success');
                    let user = {
                        userId : result.insertId,
                        userStatus : listOfValue.USER_STATUS_ACTIVE
                    }
                    user.accessToken = oAuthUtil.createAccessToken(oAuthUtil.clientType.user,user.userId,user.userStatus);
                    resUtil.resetQueryRes(res,user,null);
                }else{
                    logger.warn(' createAdminUser ' + 'false');
                    resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                }
                return next();
            }
        })
    })
}
const adminUserLogin = (req,res,next) => {
    let params = req.params;
    adminUserDao.queryAdminUser({userName:params.userName},(error,rows)=>{
        if(error){
            logger.error(' adminUserLogin ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            if(rows && rows.length < 1){
                logger.warn(' adminUserLogin ' +params.userName+ sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
                resUtil.resetFailedRes(res,sysMsg.ADMIN_LOGIN_USER_UNREGISTERED) ;
                return next();
            }else{
                let passwordMd5 = encrypt.encryptByMd5(params.password);
                if(passwordMd5 != rows[0].password){
                    logger.warn(' adminUserLogin ' +params.phone+ sysMsg.CUST_LOGIN_PSWD_ERROR);
                    resUtil.resetFailedRes(res,sysMsg.CUST_LOGIN_PSWD_ERROR) ;
                    return next();
                }else{
                    if(rows[0].status == listOfValue.ADMIN_USER_STATUS_NOT_ACTIVE){
                        let user = {
                            userId : rows[0].id,
                            userStatus : rows[0].status
                        }
                        logger.info('adminUserLogin' +params.userName+ " not verified");
                        resUtil.resetQueryRes(res,user,null);
                        return next();
                    }else{
                        let user = {
                            userId : rows[0].id,
                            status : rows[0].status,
                            type: rows[0].type
                        }
                        user.accessToken = oAuthUtil.createAccessToken(oAuthUtil.clientType.admin,user.userId,user.status);
                        oAuthUtil.saveToken(user,function(error,result){
                            if(error){
                                logger.error(' changeUserToken ' + error.stack);
                                return next(sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG))
                            }else{
                                logger.info(' changeUserToken' +params.userId+ " success");
                                resUtil.resetQueryRes(res,user,null);
                                return next();
                            }
                        })
                        // logger.info('adminUserLogin' +params.userName+ " success");
                        // resUtil.resetQueryRes(res,user,null);
                        // return next();
                    }
                }
            }
        }
    })
}
const getAdminUserInfo = (req,res,next) => {
    let params = req.params;
    adminUserDao.queryAdminInfo(params,(error,rows)=>{
        if(error){
            logger.error(' getAdminUserInfo ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info(' getAdminUserInfo ' + 'success');
            resUtil.resetQueryRes(res,rows,null);
            return next();
        }
    })
}
const updateAdminInfo = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject)=>{
        adminUserDao.queryAdminUser({adminId:params.id},(error,rows)=>{
            if(error){
                logger.error(' getAdminInfo ' + error.message);
                resUtil.resInternalError(error,res,next);
                reject(error);
            }else{
                logger.info(' getAdminInfo ' + 'success');
                if(rows.length > 0){
                    resolve();
                }else {
                    resUtil.resetFailedRes(res,sysMsg.ADMIN_NO_USER);
                }
            }
        })
    }).then(()=>{
        adminUserDao.updateInfo(params,(error,result)=>{
            if(error){
                logger.error(' updateAdminInfo ' + error.message);
                resUtil.resInternalError(error,res,next);
            }else{
                logger.info(' updateAdminInfo ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}
const changeAdminPassword = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject) => {
        adminUserDao.queryAdminUser(params,(error,rows)=>{
            if(error){
                logger.error(' changeAdminPassword ' + error.message);
                resUtil.resInternalError(error,res,next);
            }else{
                if(rows && rows.length<1){
                    logger.warn(' changeAdminPassword ' + sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
                    resUtil.resetFailedRes(res,sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
                    return next();
                }else if(encrypt.encryptByMd5(params.originPassword) != rows[0].password){
                    logger.warn(' changeAdminPassword ' + sysMsg.CUST_ORIGIN_PSWD_ERROR);
                    resUtil.resetFailedRes(res,sysMsg.CUST_ORIGIN_PSWD_ERROR);
                    return next();
                }else{
                    resolve();
                }
            }
        })
    }).then(() => {
        params.password = encrypt.encryptByMd5(params.newPassword);
        adminUserDao.updatePassword(params,(error,result)=>{
            if(error){
                logger.error(' changeAdminPassword ' + error.message);
                resUtil.resInternalError(error,res,next);
            }else{
                logger.info(' changeAdminPassword ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}
const addAdminUser = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject)=>{
        adminUserDao.queryAdminUser({adminId:params.adminId},(error,rows)=>{
            if(error){
                logger.error(' getAdminUser ' + error.message);
                resUtil.resInternalError(error,res,next);
                reject(error);
            }else{
                logger.info(' getAdminUser ' + 'success');
                if (rows[0].type == sysConsts.SUPER_ADMIN_TYPE){
                    resolve();
                }else {
                    resUtil.resetFailedRes(res,sysMsg.ADMIN_SUPER_USER_CREATE);
                }
            }
        })
    }).then(()=>{
        params.userName = params.phone;
        params.password = encrypt.encryptByMd5(params.password);
        adminUserDao.add(params,(error,rows)=>{
            if(error){
                logger.error(' addAdminUser ' + error.message);
                resUtil.resInternalError(error,res,next);
            }else{
                logger.info(' addAdminUser ' + 'success');
                if (rows.insertId){
                    resUtil.resetCreateRes(res,rows,null);
                    return next;
                }
            }
        })
    })
}
const updateAdminStatus = (req,res,next) => {
    let params = req.params;
    adminUserDao.updateStatus(params,(error,result)=>{
        if(error){
            logger.error(' updateAdminStatus ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info(' updateAdminStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const changeToken=(req,res,next)=>{
    let params = req.params;
    let adminUser ={
        userId:params.adminId
    }
    new Promise((resolve,reject)=>{
        adminUserDao.queryAdminUser(params,(error,rows)=>{
            if(error){
                logger.error('queryUser' + error.message);
                resUtil.resetFailedRes(error,res,next);
                reject(error);
            }else{
                logger.info('queryUser' + 'success');
                adminUser.status = rows[0].status;
            }
        });
    }).then(()=>{
        user.accessToken = oAuthUtil.createAccessToken(oAuthUtil.clientType.user,adminUser.userId,adminUser.status);
        oAuthUtil.removeToken({accessToken:params.token},function(error,result){
            if(error) {
                logger.error(' changeAdminUserToken ' + error.stack);
                resUtil.resInternalError(error,res,next);
            }else {
                logger.info(' changeAdminUserToken ' + 'success');
                oAuthUtil.saveToken(user,function(error,result){
                    if(error){
                        logger.error(' changeAdminUserToken ' + error.stack);
                        return next(sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG))
                    }else{
                        logger.info(' changeAdminUserToken' +params.adminId+ " success");
                        resUtil.resetQueryRes(res,adminUser,null);
                        return next();
                    }
                })
            }
        })
    })
};
module.exports = {
    createAdminUser,
    adminUserLogin,
    getAdminUserInfo,
    updateAdminInfo,
    changeAdminPassword,
    addAdminUser,
    updateAdminStatus,
    changeToken
}