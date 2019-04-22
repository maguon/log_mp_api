'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('InquiryInvoice.js');
const inquiryInvoiceDAO = require('../dao/InquiryInvoiceDAO.js');
const sysConsts = require("../util/SystemConst");

const getInquiryInvoice = (req,res,next) => {
    let params = req.params;
    inquiryInvoiceDAO.getInquiryInvoice(params,(error,result)=>{
        if(error){
            logger.error('getInquiryInvoice ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('getInquiryInvoice ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const addInquiryInvoice = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject)=>{
        params.status = sysConsts.USER_INVOICE.status.normal;
        inquiryInvoiceDAO.updateInquiryInvoiceStatusByUserId(params,(error,result)=>{
            if(error){
                logger.error('addInquiryInvoice updateInquiryInvoiceStatusByUserId ' + error.message);
                reject(error);
            }else{
                logger.info('addInquiryInvoice updateInquiryInvoiceStatusByUserId '+'success');
                resolve();
            }
        })
    }).then(()=>{
        inquiryInvoiceDAO.addInquiryInvoice(params,(error,result)=>{
            if(error){
                logger.error('addInquiryInvoice ' + error.message);
                resUtil.resInternalError(error,res,next);
            }else{
                logger.info('addInquiryInvoice ' + 'success');
                resUtil.resetCreateRes(res,result,null);
                return next();
            }
        })
    })
}
const updateInquiryInvoiceStatus = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject)=>{
        params.status = sysConsts.USER_INVOICE.status.normal;
        inquiryInvoiceDAO.updateInquiryInvoiceStatusByUserId(params,(error,result)=>{
            if(error){
                logger.error('updateInquiryInvoiceStatus updateInquiryInvoiceStatusByUserId ' + error.message);
                reject(error);
            }else{
                logger.info('updateInquiryInvoiceStatus updateInquiryInvoiceStatusByUserId '+'success');
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            params.status = sysConsts.USER_INVOICE.status.default;
            inquiryInvoiceDAO.updateInquiryInvoiceStatus(params,(error,result)=>{
                if(error){
                    logger.error('updateInquiryInvoiceStatus ' + error.message);
                    reject(error);
                }else{
                    logger.info('updateInquiryInvoiceStatus ' + 'success');
                    resUtil.resetUpdateRes(res,result,null);
                    return next();
                }
            })
        })
    }).catch((error)=>{
        resUtil.resInternalError(error,res,next);
    })
}
const deleteUserInvoice = (req,res,next) => {
    let params = req.params;
    inquiryInvoiceDAO.deleteById(params,(error,result)=>{
        if(error){
            logger.error('deleteUserInvoice ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('deleteUserInvoice ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const updateUserInvoice = (req,res,next) => {
    let params = req.params;
    inquiryInvoiceDAO.updateById(params,(error,result)=>{
        if(error){
            logger.error('updateUserInvoice ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('updateUserInvoice '+'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
module.exports = {
    getInquiryInvoice,
    addInquiryInvoice,
    updateInquiryInvoiceStatus,
    deleteUserInvoice,
    updateUserInvoice
}