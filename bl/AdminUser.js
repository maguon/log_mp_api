'use strict';

const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const encrypt = require('../util/Encrypt.js');
const resUtil = require('../util/ResponseUtil.js');
const listOfValue = require('../util/ListOfValue.js');
const oAuthUtil = require('../util/OAuthUtil.js');
const adminUserDao = require('../dao/AdminUserDAO.js');
const adminDeviceInfoDao = require('../dao/AdminDeviceInfoDao.js');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('AdminUser.js');
const sysConsts = require("../util/SystemConst");

const adminUserLogin = (req,res,next) => {
    let params = req.params;
    const getAdmin = () =>{
        return new Promise((resolve,reject)=>{
            adminUserDao.queryAdminUser({userName:params.userName},(error,rows)=>{
                if(error) {
                    logger.error('adminUserLogin getAdmin ' + error.message);
                    reject({err:error});
                }else{
                    if(rows && rows.length < 1) {
                        logger.warn('adminUserLogin getAdmin ' + params.userName + ' ' + sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
                        reject({msg:sysMsg.ADMIN_LOGIN_USER_UNREGISTERED});
                    }else{
                        resolve(rows[0]);
                    }
                }
            })
        });
    }
    const getPassword = (adminInfo) =>{
        return new Promise((resolve,reject)=>{
            let passwordMd5 = encrypt.encryptByMd5(params.password);
            if(passwordMd5 != adminInfo.password) {
                logger.warn('adminUserLogin getPassword ' + params.phone + ' ' + sysMsg.CUST_LOGIN_PSWD_ERROR);
                reject({msg:sysMsg.CUST_LOGIN_PSWD_ERROR});
            }else{
                if(adminInfo.status == listOfValue.ADMIN_USER_STATUS_NOT_ACTIVE) {
                    let user = {
                        userId: adminInfo.id,
                        userStatus: adminInfo.status
                    }
                    logger.info('adminUserLogin getPassword ' + params.userName + " not verified");
                    resUtil.resetQueryRes(res, user, null);
                    return next();
                }else{
                    resolve(adminInfo);
                }
            }
        });
    }
    const adminLogin = (adminInfo) =>{
        return new Promise(()=>{
            let user = {
                userId : adminInfo.id,
                status : adminInfo.status,
                type: adminInfo.type
            }
            user.accessToken = oAuthUtil.createAccessToken(oAuthUtil.clientType.admin,user.userId,user.status);
            oAuthUtil.saveToken(user,function(error,result){
                if(error){
                    logger.error('adminUserLogin adminLogin ' + error.stack);
                    return next(sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG))
                }else{
                    logger.info('adminUserLogin adminLogin ' +adminInfo.userId+ " success");
                    resUtil.resetQueryRes(res,user,null);
                    return next();
                }
            })

        });
    }
    getAdmin()
        .then(getPassword)
        .then(adminLogin)
        .catch((reject)=>{
            if(reject.err) {
                resUtil.resInternalError(reject.err, res, next);
            }else{
                resUtil.resetFailedRes(res, reject.msg);
            }
        })
}
const adminUserMobileLogin = (req,res,next) =>{
    let params = req.params;
    let userMsg={};
    const getAdminInfo = () =>{
        return new Promise((resolve,reject) => {
            adminUserDao.queryAdminUser({userName:params.userName},(error,rows)=>{
                if(error){
                    logger.error('adminUserMobileLogin queryAdminUser ' + error.message);
                    reject({err: error});
                }else{
                    //判断用户密码
                    if(rows && rows.length<0){
                        logger.warn('adminUserMobileLogin queryAdminUser ' +params.adminId+' '+sysMsg.CUST_SIGNUP_REGISTERED);
                        reject({msg:sysMsg.CUST_SIGNUP_REGISTERED});
                    }else{
                        let passwordMd5 = encrypt.encryptByMd5(params.password);
                        if(passwordMd5 != rows[0].password){
                            //密码不匹配
                            logger.warn('adminUserMobileLogin queryPassword: ' +params.adminId+' '+sysMsg.CUST_LOGIN_PSWD_ERROR);
                            reject({msg:sysMsg.CUST_SIGNUP_REGISTERED});
                        }else{
                            //密码正确
                            if(rows[0].status == listOfValue.ADMIN_USER_STATUS_NOT_ACTIVE){
                                logger.info('adminUserMobileLogin queryStatus ' +params.userName+ " not verified ");
                                reject({msg:"该管理员不可用!"});
                            }else {
                                params.adminId  = rows[0].id;
                                params.status  = rows[0].status;
                                logger.info('queryAdminUser: ' +params.userName+ " not verified ");
                                userMsg.userName = rows[0].user_name;
                                userMsg.userId = rows[0].id;
                                userMsg.status = rows[0].status;
                                resolve(params);
                            }
                        }
                    }
                }
            })
        });
    }
    const getAdminDeviceInfo = (devinfo) => {
        return new Promise((resolve,reject)=>{
            adminDeviceInfoDao.getDeviceInfo({adminId:devinfo.adminId,deviceType:devinfo.deviceType,deviceToken:devinfo.deviceToken},(error,rows)=>{
                if(error){
                    logger.error('adminUserMobileLogin getDeviceInfo ' + error.message);
                    reject({err: error});
                } else {
                    if(rows && rows.length>0){
                        logger.info('adminUserMobileLogin getDeviceInfo ' + devinfo.adminId +' '+sysMsg.CUST_SIGNUP_REGISTERED);
                        resolve({rows:rows[0]});
                    }else{
                        resolve({info:devinfo});
                    }
                }
            })
        });
    }
    const updataDeviceInfo = (row) =>{
        return new Promise((resolve,reject) =>{
            adminDeviceInfoDao.updateDeviceInfo({adminId:row.id,appType:params.appType,appVersion:params.appVersion},(error,rows)=>{
                if(error){
                    logger.error('adminUserMobileLogin updateDeviceInfo ' + error.message);
                    reject({err: error});
                }else{
                    logger.info('adminUserMobileLogin updateDeviceInfo ' + 'success');
                    resUtil.resetQueryRes(res,userMsg,null);
                    return next();
                }
            })
        });
    }
    const insterDeviceInfo = (devinfo) =>{
        return new Promise((resolve,reject)=>{
            adminDeviceInfoDao.addDeviceInfo(devinfo,(error,rows)=>{
                if(error){
                    logger.error('adminUserMobileLogin addDeviceInfo ' + error.message);
                    reject({err: error});
                }else{
                    logger.info('adminUserMobileLogin addDeviceInfo ' + 'success');
                    resUtil.resetQueryRes(res,userMsg,null);
                    return next();
                }
            })
        });
    }
    getAdminInfo()
        .then(getAdminDeviceInfo)
        .then((resolve)=>{
            if(resolve.info){
                insterDeviceInfo(resolve.info);
            }else{
                updataDeviceInfo(resolve.rows);
            }
        })
        .catch((reject)=>{
            if(reject.err){
                resUtil.resInternalError(reject.err,res,next);
            }else if(reject.msg){
                resUtil.resetFailedRes(res,reject.msg) ;
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
                logger.error('updateAdminInfo queryAdminUser ' + error.message);
                resUtil.resInternalError(error,res,next);
                reject(error);
            }else{
                logger.info('updateAdminInfo queryAdminUser ' + 'success');
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
                logger.error('updateAdminInfo updateInfo ' + error.message);
                resUtil.resInternalError(error,res,next);
            }else{
                logger.info('updateAdminInfo updateInfo ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}
const changeAdminPassword = (req,res,next) => {
    let params = req.params;
    const getAdminInfo = ()=>{
        return new Promise( (resolve, reject) =>{
            adminUserDao.queryAdminUser(params,(error,rows)=>{
                if(error){
                    logger.error('changeAdminPassword queryAdminUser ' + error.message);
                    reject({err:error});
                }else {
                    if(rows  && rows.length>=1){
                        if(encrypt.encryptByMd5(params.originPassword) != rows[0].password){
                            logger.warn(' changeAdminPassword queryAdminUser '+params.adminId+ ' ' +sysMsg.CUST_ORIGIN_PSWD_ERROR)
                            reject({msg:sysMsg.CUST_ORIGIN_PSWD_ERROR});
                        }else{
                            resolve(rows[0]);
                        }
                    }else{
                        logger.warn('changeAdminPassword queryAdminUser ' +params.adminId + ' ' +sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
                        reject({msg:sysMsg.ADMIN_LOGIN_USER_UNREGISTERED});
                    }
                }
            })
        });
    }
    const updateAdminPassword = (adminInfo)=>{
        return new Promise( (resolve, reject) => {
            params.password = encrypt.encryptByMd5(params.newPassword);
            adminUserDao.updatePassword(params,(error,result)=>{
                if(error){
                    logger.error('changeAdminPassword updatePassword ' + error.message);
                    reject({err:error})
                }else{
                    logger.info('changeAdminPassword updatePassword ' + 'success');
                    resUtil.resetUpdateRes(res,result,null);
                    return next();
                }
            })
        });
    }
    getAdminInfo()
        .then(updateAdminPassword)
        .catch((reject)=>{
            if(reject.err){
                resUtil.resInternalError(reject.err,res,next);
            }else{
                resUtil.resetFailedRes(res,reject.msg);
                return next();
            }
        })
}
const addAdminUser = (req,res,next) => {
    let params = req.params;
    const getAdminId = () =>{
        return new Promise((resolve,reject)=>{
            adminUserDao.queryAdminUser({adminId:params.adminId},(error,rows)=>{
                if(error){
                    logger.error('addAdminUser getAdminId ' + error.message);
                    reject(error);
                }else{
                    logger.info('addAdminUser getAdminId ' + 'success');
                    if (rows[0].type == sysConsts.SUPER_ADMIN_TYPE){
                        resolve(params);
                    }else {
                        reject({msg:sysMsg.ADMIN_SUPER_USER_CREATE});

                    }
                }
            })

        });
    }
    const getAdminInfo = (adminInfo) =>{
        return new Promise((resolve,reject)=>{
            adminUserDao.queryAdminUser({phone:adminInfo.phone},(error,rows)=>{
                if (error) {
                    logger.error('addAdminUser getAdminInfo ' + error.message );
                    reject({err:error});
                } else {
                    if(rows && rows.length>0){
                        logger.warn('addAdminUser getAdminInfo ' +adminInfo.phone+' '+sysMsg.CUST_SIGNUP_REGISTERED );
                        reject({msg:sysMsg.CUST_SIGNUP_REGISTERED});
                    }else{
                        params.status = sysConsts.ADMIN_INFO.Status.available;
                        resolve(adminInfo);
                    }
                }
            })
        });
    }
    const insterAdminInfo = (adminInfo) =>{
        return new Promise((resolve,reject)=>{
            adminInfo.userName = adminInfo.phone;
            adminInfo.password = encrypt.encryptByMd5(adminInfo.password);
            adminUserDao.add(adminInfo,(error,rows)=>{
                if(error){
                    logger.error('addAdminUser insterAdminInfo ' + error.message);
                    reject(error);
                }else{
                    logger.info('addAdminUser insterAdminInfo ' + 'success');
                    if (rows.insertId){
                        resUtil.resetCreateRes(res,rows,null);
                        return next();
                    }
                }
            })
        });
    }
    getAdminId()
        .then(getAdminInfo)
        .then(insterAdminInfo)
        .catch((reject)=>{
            if(reject.err){
                resUtil.resInternalError(reject.err,res,next);
            }else{
                resUtil.resetFailedRes(res,reject.msg);
            }
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
                logger.error('changeToken queryUser: ' + error.message);
                resUtil.resetFailedRes(error,res,next);
                reject(error);
            }else{
                logger.info('changeToken queryUser: ' + 'success');
                adminUser.status = rows[0].status;
                resolve();
            }
        });
    }).then(()=>{
        user.accessToken = oAuthUtil.createAccessToken(oAuthUtil.clientType.user,adminUser.userId,adminUser.status);
        oAuthUtil.removeToken({accessToken:params.token},function(error,result){
            if(error) {
                logger.error('changeAdminUserToken ' + error.stack);
                resUtil.resInternalError(error,res,next);
            }else {
                logger.info(' changeAdminUserToken ' + 'success');
                oAuthUtil.saveToken(user,function(error,result){
                    if(error){
                        logger.error(' changeAdminUserToken ' + error.stack);
                        return next(sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG))
                    }else{
                        logger.info(' changeAdminUserToken ' +params.adminId+ " success");
                        resUtil.resetQueryRes(res,adminUser,null);
                        return next();
                    }
                })
            }
        })
    })
};
module.exports = {
    adminUserLogin,
    adminUserMobileLogin,
    getAdminUserInfo,
    updateAdminInfo,
    changeAdminPassword,
    addAdminUser,
    updateAdminStatus,
    changeToken
}