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
const getAdminByRouteId = (req,res,next) => {
    let params = req.params;
    adminUserDAO.getAdminByRouteId(params,(error,result)=>{
        if(error){
            logger.error('getAdminByRouteId' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getAdminByRouteId' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const getAdminUserIdRouteId = (req,res,next) => {
    let params = req.params;
    adminUserDAO.getAdminUserIdRouteId(params,(error,result)=>{
        if(error){
            logger.error('getAdminUserIdRouteId' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getAdminUserIdRouteId' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const getAdminUserIdRouteIdOrder = (req,res,next) => {
    let params = req.params;
    adminUserDAO.getAdminUserIdRouteIdOrder(params,(error,result)=>{
        if(error){
            logger.error('getAdminUserIdRouteIdOrder' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getAdminUserIdRouteIdOrder' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const getAdminUserContact = (req,res,next) => {
    let params = req.params;
    adminUserDAO.getAdminUserContact(params,(error,result)=>{
        if(error){
            logger.error('getAdminUserContact' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getAdminUserContact' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const getAdminUserBank = (req,res,next) => {
    let params = req.params;
    adminUserDAO.getAdminUserBank(params,(error,result)=>{
        if(error){
            logger.error('getAdminUserBank' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getAdminUserBank' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const getAdminUserInvoice = (req,res,next) => {
    let params = req.params;
    adminUserDAO.getAdminUserInvoice(params,(error,result)=>{
        if(error){
            logger.error('getAdminUserInvoice' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getAdminUserInvoice' + 'success');
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
    getAdminUserIdRouteId,
    getAdminByRouteId,
    getAdminUserIdRouteIdOrder,
    getAdminUserContact,
    getAdminUserBank,
    getAdminUserInvoice,
    getAdminUserId
}