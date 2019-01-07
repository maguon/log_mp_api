'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('RefundApply.js');
const refundApplyDAO = require('../dao/RefundApplyDAO.js');
const sysConst = require("../util/SystemConst");
const paymentDAO = require("../dao/PaymentDAO");
const moment = require('moment/moment.js');

const addRefundApply = (req,res,next)=>{
    let params = req.params;
    refundApplyDAO.addRefundApply(params,(error,result)=>{
        if(error){
            logger.error('addRefundApply' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('addRefundApply' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    });
}
const getRefundApply = (req,res,next)=>{
    let params = req.params;
    refundApplyDAO.getRefundApply(params,(error,result)=>{
        if(error){
            logger.error('getRefundApply' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('getRefundApply' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
}
const updateRefuseStatus = (req,res,next)=>{
    let params = req.params;
    params.status = sysConst.REFUND_STATUS.refuse;
    refundApplyDAO.updateRefuseStatus(params,(error,result)=>{
        if(error){
            logger.error('updateRefuseStatus' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('updateRefuseStatus' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
const updateRefundStatus = (req,res,next)=>{
    let params = req.params;
    new Promise((resolve,reject)=>{
        params.status = sysConst.REFUND_STATUS.refunded;
        refundApplyDAO.updateRefundStatus(params,(error,result)=>{
            if(error){
                logger.error('updateRefundStatus' + error.message);
                resUtil.resInternalError(error, res, next);
                reject(error);
            }else{
                logger.info('updateRefundStatus' + 'success');
                resolve();
            }
        });
    }).then(()=> {
        new Promise((resolve,reject)=>{
            paymentDAO.getById(params,(error,rows)=>{
                if(error){
                    logger.error('getPaymentById' + error.message);
                    resUtil.resInternalError(error, res, next);
                    reject(error);
                }else{
                    logger.info('getPaymentById' + 'success');
                    params.bank = rows[0].bank;
                    params.bankCode = rows[0].bank_code;
                    params.accountName = rows[0].account_name;
                    resolve();
                }
            })
        }).then(()=>{
            new Promise((resolve,reject)=>{
                params.totalFee = 0 - params.refundFee;
                params.dateId = moment(new Date()).format('YYYYMMDD');
                params.status = sysConst.PAYMENT.status.paid;
                params.paymentType = sysConst.PAYMENT.paymentType.bankTransfer;
                params.type = sysConst.PAYMENT.type.refund;
                paymentDAO.addRefundPayment(params,(error,rows)=>{
                    if(error){
                        logger.error('addRefundPayment' + error.message);
                        resUtil.resInternalError(error, res, next);
                        reject(error);
                    }else{
                        logger.info('addRefundPayment' + 'success');
                        params.paymentRefundId = rows.insertId;
                        resolve();
                    }
                })
            }).then(()=>{
                refundApplyDAO.updatePaymentRefundId(params, (error, result) => {
                    if (error) {
                        logger.error('updatePaymentRefundId' + error.message);
                        resUtil.resInternalError(error, res, next);
                    } else {
                        logger.info('updatePaymentRefundId' + 'success');
                        resUtil.resetUpdateRes(res, result, null);
                        return next();
                    }
                })
            })
        })
    }).catch((error)=>{
        resUtil.resInternalError(error,res,next);
    })
}
const getRefundApplyStat = (req,res,next)=>{
    let params = req.params;
    refundApplyDAO.getRefundApplyStat(params,(error,result)=>{
        if(error){
            logger.error('getRefundApplyStat' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('getRefundApplyStat' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
}
const updateRefundById = (req,res,next)=>{
    let params = req.params;
    refundApplyDAO.updateRefundById(params,(error,result)=>{
        if(error){
            logger.error('updateRefundById:' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('updateRefundById:' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
const deleteById = (req,res,next)=>{
    let params = req.params;
    refundApplyDAO.deleteById(params,(error,result)=>{
        if(error){
            logger.error('deleteRefundApply:' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('deleteRefundApply:' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
module.exports = {
    addRefundApply,
    getRefundApply,
    updateRefuseStatus,
    updateRefundStatus,
    getRefundApplyStat,
    updateRefundById,
    deleteById
}