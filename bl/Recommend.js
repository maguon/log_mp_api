'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('Recommend.js');
const sysConsts = require("../util/SystemConst");
const sysConfig = require("../config/SystemConfig");
const recommendInfoDAO = require("../dao/RecommendInfoDAO");
const adminUser = require('../dao/AdminUserDAO');

const addRecommend = (req,res,next)=>{
    let params = req.params;
    new Promise((resolve,reject)=>{
        adminUser.queryAdminUser(params,(error,result)=>{
            if(error){
                logger.error('queryAdminUser' + error.message);
                resUtil.resInternalError(error, res, next);
                reject(error);
            }else{
                logger.info('queryAdminUser' + 'success');
                if (result.length > 0){
                    resolve();
                } else {
                    resUtil.resetFailedRes(res,sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
                }
            }
        });
    }).then(()=>{
        recommendInfoDAO.add(params,(error,result)=>{
            if(error){
                logger.error('addRecommend' + error.message);
                resUtil.resInternalError(error, res, next);
            }else{
                logger.info('addRecommend' + 'success');
                resUtil.resetCreateRes(res,result,null);
                return next();
            }
        });
    })
}
const getRecommend = (req,res,next)=>{
    let params = req.params;
    new Promise((resolve,reject)=>{
        adminUser.queryAdminUser(params,(error,result)=>{
            if(error){
                logger.error('queryAdminUser' + error.message);
                resUtil.resInternalError(error, res, next);
                reject(error);
            }else{
                logger.info('queryAdminUser' + 'success');
                if (result.length > 0){
                    resolve();
                } else {
                    resUtil.resetFailedRes(res,sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
                }
            }
        });
    }).then(()=>{
        recommendInfoDAO.select(params,(error,result)=>{
            if(error){
                logger.error('selectRecommend' + error.message);
                resUtil.resInternalError(error, res, next);
            }else{
                logger.info('selectRecommend' + 'success');
                resUtil.resetQueryRes(res,result,null);
                return next();
            }
        });
    })
}
const updateRecommend = (req,res,next)=>{
    let params = req.params;
    new Promise((resolve,reject)=>{
        adminUser.queryAdminUser(params,(error,result)=>{
            if(error){
                logger.error('queryAdminUser' + error.message);
                resUtil.resInternalError(error, res, next);
                reject(error);
            }else{
                logger.info('queryAdminUser' + 'success');
                if (result.length > 0){
                    resolve();
                } else {
                    resUtil.resetFailedRes(res,sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
                }
            }
        });
    }).then(()=>{
        recommendInfoDAO.update(params,(error,result)=>{
            if(error){
                logger.error('updateRecommend' + error.message);
                resUtil.resInternalError(error, res, next);
            }else{
                logger.info('updateRecommend' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        });
    })
}
const addAdvertisement = (req,res,next)=>{
    let params = req.params;
    new Promise((resolve,reject)=>{
        adminUser.queryAdminUser(params,(error,result)=>{
            if(error){
                logger.error('queryAdminUser' + error.message);
                resUtil.resInternalError(error, res, next);
                reject(error);
            }else{
                logger.info('queryAdminUser' + 'success');
                if (result.length > 0){
                    resolve();
                } else {
                    resUtil.resetFailedRes(res,sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
                }
            }
        });
    }).then(()=>{
        recommendInfoDAO.update(params,(error,result)=>{
            if(error){
                logger.error('updateRecommend' + error.message);
                resUtil.resInternalError(error, res, next);
            }else{
                logger.info('updateRecommend' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        });
    })
}
module.exports={
    addRecommend,
    getRecommend,
    updateRecommend,
    addAdvertisement
}