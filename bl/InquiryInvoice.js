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
    const updateInvoice = ()=>{
        return new Promise((resolve,reject)=>{
            inquiryInvoiceDAO.updateInquiryInvoiceStatusByUserId(params,(error,result)=>{
                if(error){
                    logger.error('addInquiryInvoice updateInvoice ' + error.message);
                    reject(error);
                }else{
                    logger.info('addInquiryInvoice updateInvoice '+'success');
                    resolve(params);
                }
            })
        });
    }
    const addInvoice = (invoiceInfo)=>{
        return new Promise((resolve,reject)=>{
            inquiryInvoiceDAO.addInquiryInvoice(invoiceInfo,(error,result)=>{
                if(error){
                    logger.error('addInquiryInvoice addInvoice ' + error.message);
                    reject(error);
                }else{
                    logger.info('addInquiryInvoice addInvoice ' + 'success');
                    resUtil.resetCreateRes(res,result,null);
                    return next();
                }
            })
        });
    }
    updateInvoice()
        .then(addInvoice)
        .catch((reject)=>{
            resUtil.resInternalError(reject,res,next);
        })
}
const updateInquiryInvoiceStatus = (req,res,next) => {
    let params = req.params;
    const updateStatusByUserId = ()=>{
        return new Promise((resolve,reject)=>{
            params.status = sysConsts.USER_INVOICE.status.normal;
            inquiryInvoiceDAO.updateInquiryInvoiceStatusByUserId(params,(error,result)=>{
                if(error){
                    logger.error('updateInquiryInvoiceStatus updateStatusByUserId ' + error.message);
                    reject(error);
                }else{
                    logger.info('updateInquiryInvoiceStatus updateStatusByUserId '+'success');
                    resolve(params);
                }
            })
        });
    }
    const updateInvoice = (invoiceInfo)=>{
        return new Promise((resolve,reject)=>{
            invoiceInfo.status = sysConsts.USER_INVOICE.status.default;
            inquiryInvoiceDAO.updateInquiryInvoiceStatus(invoiceInfo,(error,result)=>{
                if(error){
                    logger.error('updateInquiryInvoiceStatus updateInvoice ' + error.message);
                    reject(error);
                }else{
                    logger.info('updateInquiryInvoiceStatus updateInvoice ' + 'success');
                    resUtil.resetUpdateRes(res,result,null);
                    return next();
                }
            })
        });
    }
    updateStatusByUserId()
        .then(updateInvoice)
        .catch((reject)=>{
            resUtil.resInternalError(reject,res,next);
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