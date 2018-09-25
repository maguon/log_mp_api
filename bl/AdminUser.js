'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('AdminUser.js');
const adminUserDAO = require('../dao/AdminUserDAO.js');

const getAdminUser = (req,res,next) => {
    let params = req.params;
    adminUserDAO.getAdminUser(params,(error,result)=>{
        if(error){
            logger.error('getAdminUser' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getAdminUser' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const getAdminUserById = (req,res,next) => {
    let params = req.params;
    adminUserDAO.getAdminUserById(params,(error,result)=>{
        if(error){
            logger.error('getAdminUserById' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getAdminUserById' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const getAdminUserByIdInquiry = (req,res,next) => {
    let params = req.params;
    adminUserDAO.getAdminUserByIdInquiry(params,(error,result)=>{
        if(error){
            logger.error('getAdminUserByIdInquiry' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getAdminUserByIdInquiry' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const getAdminUserId = (req,res,next) => {
    let params = req.params;
}
module.exports = {
    getAdminUser,
    getAdminUserById,
    getAdminUserByIdInquiry,
    getAdminUserId
}