'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('InquiryUser.js');
const inquiryUserDAO = require('../dao/InquiryUserDAO.js');

const getAdminUser = (req,res,next) => {
    let params = req.params;
    inquiryUserDAO.getAdminUser(params,(error,result)=>{
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
const getUserById = (req,res,next) => {
    let params = req.params;
    inquiryUserDAO.getUserById(params,(error,result)=>{
        if(error){
            logger.error('getUserById' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getUserById' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const getUserByIdInquiry = (req,res,next) => {
    let params = req.params;
    inquiryUserDAO.getUserByIdInquiry(params,(error,result)=>{
        if(error){
            logger.error('getUserByIdInquiry' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getUserByIdInquiry' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const getUserInquiryById = (req,res,next) => {
    let params = req.params;
    inquiryUserDAO.getUserInquiryById(params,(error,result)=>{
        if(error){
            logger.error('getUserInquiryById' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getUserInquiryById' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const getUserByIdInquiryIdRoute = (req,res,next) => {
    let params = req.params;
    inquiryUserDAO.getUserByIdInquiryIdRoute(params,(error,result)=>{
        if(error){
            logger.error('getUserByIdInquiryIdRoute' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getUserByIdInquiryIdRoute' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const getUserIdRouteIdOrder = (req,res,next) => {
    let params = req.params;
    inquiryUserDAO.getUserIdRouteIdOrder(params,(error,result)=>{
        if(error){
            logger.error('getUserIdRouteIdOrder' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getUserIdRouteIdOrder' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const getUserContact = (req,res,next) => {
    let params = req.params;
    inquiryUserDAO.getUserContact(params,(error,result)=>{
        if(error){
            logger.error('getUserContact' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getUserContact' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const getUserBank = (req,res,next) => {
    let params = req.params;
    inquiryUserDAO.getUserBank(params,(error,result)=>{
        if(error){
            logger.error('getUserBank' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getUserBank' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const getUserInvoice = (req,res,next) => {
    let params = req.params;
    inquiryUserDAO.getUserInvoice(params,(error,result)=>{
        if(error){
            logger.error('getUserInvoice' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getUserInvoice' + 'success');
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
    getUserById,
    getUserByIdInquiry,
    getUserByIdInquiryIdRoute,
    getUserInquiryById,
    getUserIdRouteIdOrder,
    getUserContact,
    getUserBank,
    getUserInvoice,
    getAdminUserId
}