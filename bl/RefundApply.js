'use strict';
const xml2js = require('xml2js');
const encrypt = require('../util/Encrypt.js');
const fs = require('fs');
const https = require('https');
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('RefundApply.js');
const refundApplyDAO = require('../dao/RefundApplyDAO.js');
const sysConst = require("../util/SystemConst");
const paymentDAO = require("../dao/PaymentDAO");
const moment = require('moment/moment.js');
const orderInfoDAO = require("../dao/InquiryOrderDAO");
const sysConfig = require("../config/SystemConfig");
const payment = require("Payment");

const addRefundApply = (req,res,next)=>{
    let params = req.params;
    params.dateId = moment().format("YYYYMMDD");
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
const updateRefundApplyMsg = (req,res,next)=>{
    let params = req.params;
    new Promise((resolve,reject)=> {
        paymentDAO.getById({paymentId:params.paymentId},(error,rows)=>{
            if (error){
                logger.info("getPaymentById"+error.message);
                resUtil.resetFailedRes(res,error);
                reject(error);
            }else {
                if (rows.length > 0){
                    resolve();
                } else {
                    resUtil.resetFailedRes(res,sysMsg.ADMIN_PAYMENT_NO_MSG);
                    reject(error);
                }
            }
        })
    }).then(()=>{
        refundApplyDAO.updateById(params,(error,result)=>{
            if(error){
                logger.error('updateRefundApplyMsg:' + error.message);
                resUtil.resInternalError(error, res, next);
            }else{
                logger.info('updateRefundApplyMsg:' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        });
    })
}
const updateRefundStatus = (req,res,next)=>{
    let params = req.params;
    let paymentType = "";
    let totalFee = 0;
    new Promise((resolve,reject)=>{
        paymentDAO.getById(params,(error,rows)=>{
            if(error){
                logger.error('getPaymentById' + error.message);
                resUtil.resInternalError(error, res, next);
                reject(error);
            }else{
                logger.info('getPaymentById' + 'success');
                if (rows[0].total_fee < params.refundFee) {
                    resUtil.resetFailedRes( res, sysMsg.ADMIN_PAYMENT_REFUND_PRICE);
                    reject(error);
                }else{
                    params.bank = rows[0].bank;
                    params.bankCode = rows[0].bank_code;
                    params.accountName = rows[0].account_name;
                    totalFee = rows[0].total_fee;
                    paymentType = rows[0].payment_type;
                    params.paymentRefundId = rows[0].id;
                    params.userId = rows[0].user_id;
                    params.wxOrderId = rows[0].wx_order_id;
                    resolve();
                }
            }
        })
    }).then(()=> {
        new Promise((resolve,reject)=>{
            params.totalFee = 0 - params.refundFee;
            params.dateId = moment(new Date()).format('YYYYMMDD');
            params.status = sysConst.PAYMENT.status.paid;
            params.type = sysConst.PAYMENT.type.refund;
            params.dateId = moment().format("YYYYMMDD");
            if (paymentType == sysConst.PAYMENT.paymentType.wechat){
                params.paymentType = sysConst.PAYMENT.paymentType.wechat;
                payment.wechatRefund(req,res,next);
            } else if(paymentType == sysConst.PAYMENT.paymentType.bankTransfer){
                params.paymentType = sysConst.PAYMENT.paymentType.bankTransfer;
                paymentDAO.addRefundPayment(params,(error,rows)=>{
                    if(error){
                        logger.error('addRefundPayment' + error.message);
                        resUtil.resInternalError(error, res, next);
                        reject(error);
                    }else{
                        logger.info('addRefundPayment' + 'success');
                        params.paymentRefundId = rows.insertId;
                        new Promise((resolve,reject)=>{
                            params.status = sysConst.REFUND_STATUS.refunded;
                            params.refundFee = - params.refundFee;
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
                        }).then(()=>{
                            new Promise((resolve,reject)=> {
                                refundApplyDAO.updatePaymentRefundId(params, (error, result) => {
                                    if (error) {
                                        logger.error('updatePaymentRefundId' + error.message);
                                        resUtil.resInternalError(error, res, next);
                                        reject(error);
                                    } else {
                                        logger.info('updatePaymentRefundId' + 'success');
                                        resolve();
                                    }
                                })
                            }).then(()=>{
                                new Promise((resolve,reject)=> {
                                    orderInfoDAO.getById(params, (error, rows) => {
                                        if (error) {
                                            logger.error('getOrderById' + error.message);
                                            resUtil.resInternalError(error, res, next);
                                            reject(error);
                                        } else {
                                            logger.info('getOrderById' + 'success');
                                            params.realPaymentPrice = rows[0].real_payment_price - params.refundFee;
                                            resolve();
                                        }
                                    })
                                }).then(()=>{
                                    orderInfoDAO.updateRealPaymentPrice(params, (error, result) => {
                                        if (error) {
                                            logger.error('updateRealPaymentPrice' + error.message);
                                            resUtil.resInternalError(error, res, next);
                                        } else {
                                            logger.info('updateRealPaymentPrice' + 'success');
                                            resUtil.resetUpdateRes(res, result, null);
                                            return next();
                                        }
                                    })
                                })

                            })
                        })
                    }
                })
            }
        })
    }).catch((error)=>{
        resUtil.resInternalError(error,res,next);
    })
}
const wechatRefundResult = (req,res,next)=>{
    let prepayIdJson = {
        status: 1
    };
    new Promise((resolve,reject)=>{
        let xmlParser = new xml2js.Parser({explicitArray : false, ignoreAttrs : true});
        xmlParser.parseString(req.body,(err,result)=>{
            let resString = JSON.stringify(result);
            let evalJson = eval('(' + resString + ')');
            let md5Key = encrypt.encryptByMd5NoKey(sysConfig.wechatConfig.paymentKey).toLowerCase();
            let reqInfo = evalJson.xml.req_info;
            let reqResult = encrypt.decryption(reqInfo,md5Key);
            xmlParser.parseString(reqResult,(err,result)=>{
                let resStrings = JSON.stringify(result);
                let evalJsons = eval('(' + resStrings + ')');
                prepayIdJson.paymentId = evalJsons.root.out_refund_no;
                prepayIdJson.settlement_refund_fee = evalJsons.root.settlement_refund_fee / 100;
                prepayIdJson.wxOrderId = evalJsons.root.out_trade_no;
            })
            logger.info("wechatRefundResult =>"+prepayIdJson);
            paymentDAO.updateRefund(prepayIdJson,(error,result)=>{
                if(error){
                    logger.error('updateRefund' + error.message);
                    reject(error);
                }else{
                    logger.info('updateRefund' + 'success');
                    resolve();
                }
            });
        });
    }).then(()=>{
        paymentDAO.getPaymentById({paymentId:prepayIdJson.paymentId},(error,rows)=>{
            if(error){
                logger.error('getPaymentById' + error.message);
                resUtil.resInternalError(error, res, next);
            }else{
                logger.info('getPaymentById' + 'success');
                prepayIdJson.paymentPID = rows[0].p_id;
                let options ={
                    status:sysConsts.REFUND_STATUS.refunded,
                    refundFee:prepayIdJson.settlement_refund_fee,
                    orderId:prepayIdJson.wxOrderId.split("_")[0],
                    paymentId:prepayIdJson.paymentPID,
                    paymentRefundId:prepayIdJson.paymentId
                }
                refundApplyDAO.updateRefundByOrder(options, (error, result) => {
                    if (error) {
                        logger.error('updatePaymentRefundId' + error.message);
                        resUtil.resInternalError(error, res, next);
                    } else {
                        logger.info('updatePaymentRefundId' + 'success');
                        new Promise((resolve,reject)=> {
                            paymentDAO.getOrderRealPayment({orderId:options.orderId}, (error, rows) => {
                                if (error) {
                                    logger.error('getOrderRealPayment' + error.message);
                                    resUtil.resInternalError(error, res, next);
                                    reject(error);
                                } else {
                                    logger.info('getOrderRealPayment' + 'success');
                                    options.realPaymentPrice = rows[0].real_payment;
                                    resolve();
                                }
                            })
                        }).then(()=>{
                            orderInfoDAO.updateRealPaymentPrice(options, (error, result) => {
                                if (error) {
                                    logger.error('updateRealPaymentPriceOfWechatRefund' + error.message);
                                    resUtil.resInternalError(error, res, next);
                                } else {
                                    logger.info('updateRealPaymentPriceOfWechatRefund' + 'success');
                                    resUtil.resetUpdateRes(res, result, null);
                                    return next();
                                }
                            })
                        })
                    }
                })
            }
        });
    })
}

const refundInMonth = (req,res,next)=>{
    let params = req.params;
    params.dbMonth = moment().format("YYYYMM");
    params.status = sysConst.REFUND_STATUS.applying;
    refundApplyDAO.statisticsRefundPrice(params,(error,result)=>{
        if(error){
            logger.error('statisticsRefundPrice:' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('statisticsRefundPrice:' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
}
module.exports = {
    addRefundApply,
    getRefundApply,
    refundInMonth,
    updateRefuseStatus,
    updateRefundStatus,
    getRefundApplyStat,
    updateRefundById,
    deleteById,
    updateRefundApplyMsg,
    wechatRefundResult
}