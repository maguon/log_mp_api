'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('Inquiry.js');
const inquiryDAO = require('../dao/InquiryDAO.js');
const inquiryCarDAO = require('../dao/InquiryCarDAO.js');
const inquiryOrderDAO = require('../dao/InquiryOrderDAO.js');
const inquiryContactDAO = require('../dao/InquiryContactDAO.js');
const inquiryBankDAO = require('../dao/InquiryBankDAO.js');
const inquiryInvoiceDAO = require('../dao/InquiryInvoiceDAO.js');

const addRouteInquiry = (req,res,next) => {
    let params = req.params;
    inquiryDAO.addRouteInquiry(params,(error,result)=>{
        if(error){
            logger.error('addRouteInquiry' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('addRouteInquiry' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}
const getInquiryByUserId = (req,res,next) => {
    let params = req.params;
    inquiryDAO.getInquiryByUserId(params,(error,result)=>{
        if(error){
            logger.error('getInquiryByUserId' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getInquiryByUserId' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const getInquiryCarByInquiryId = (req,res,next) => {
    let params = req.params;
    inquiryCarDAO.getInquiryCarByInquiryId(params,(error,result)=>{
        if(error){
            logger.error('getInquiryCarByInquiryId' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getInquiryCarByInquiryId' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const getInquiryOrderByInquiryId = (req,res,next) => {
    let params = req.params;
    inquiryOrderDAO.getInquiryOrderByInquiryId(params,(error,result)=>{
        if(error){
            logger.error('getInquiryOrderByInquiryId' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getInquiryOrderByInquiryId' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const getInquiryContactByInquiryId = (req,res,next) => {
    let params = req.params;
    inquiryContactDAO.getInquiryContactByInquiryId(params,(error,result)=>{
        if(error){
            logger.error('getInquiryContactByInquiryId' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getInquiryContactByInquiryId' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const getInquiryBankByInquiryId = (req,res,next) => {
    let params = req.params;
    inquiryBankDAO.getInquiryBankByInquiryId(params,(error,result)=>{
        if(error){
            logger.error('getInquiryBankByInquiryId' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getInquiryBankByInquiryId' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const getInquiryInvoiceByInquiryId = (req,res,next) => {
    let params = req.params;
    inquiryInvoiceDAO.getInquiryInvoiceByInquiryId(params, (error, result) => {
        if (error) {
            logger.error('getInquiryInvoiceByInquiryId' + error.message);
            throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info('getInquiryInvoiceByInquiryId' + 'success');
            resUtil.resetQueryRes(res, result, null);
            return next();
        }
    })
}
const updateInquiryStatus = (req,res,next) => {
    let params = req.params;
    inquiryDAO.updateInquiryStatus(params,(error,result)=>{
        if(error){
            logger.error('updateInquiryStatus' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('updateInquiryStatus' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const addInquiryOrder = (req,res,next) => {
    let params = req.params;
    inquiryDAO.addInquiryOrder(params,(error,result)=>{
        if(error){
            logger.error('addInquiryOrder' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('addInquiryOrder' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}
module.exports = {
    addRouteInquiry,
    getInquiryByUserId,
    getInquiryCarByInquiryId,
    getInquiryOrderByInquiryId,
    getInquiryContactByInquiryId,
    getInquiryBankByInquiryId,
    getInquiryInvoiceByInquiryId,
    updateInquiryStatus,
    addInquiryOrder
}