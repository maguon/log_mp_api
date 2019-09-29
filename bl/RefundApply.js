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
const wechatUtil = require('../util/WechatUtil.js');

const addRefundApply = (req,res,next)=>{
    let params = req.params;
    params.dateId = moment().format("YYYYMMDD");
    refundApplyDAO.addRefundApply(params,(error,result)=>{
        if(error){
            logger.error('addRefundApply ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('addRefundApply ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    });
}
const getRefundApply = (req,res,next)=>{
    let params = req.params;
    refundApplyDAO.getRefundApply(params,(error,result)=>{
        if(error){
            logger.error('getRefundApply ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('getRefundApply ' + 'success');
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
            logger.error('updateRefuseStatus ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('updateRefuseStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
const getRefundApplyStat = (req,res,next)=>{
    let params = req.params;
    refundApplyDAO.getRefundApplyStat(params,(error,result)=>{
        if(error){
            logger.error('getRefundApplyStat ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('getRefundApplyStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
}
const updateRefundById = (req,res,next)=>{
    let params = req.params;
    refundApplyDAO.updateRefundById(params,(error,result)=>{
        if(error){
            logger.error('updateRefundById ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('updateRefundById ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
const deleteById = (req,res,next)=>{
    let params = req.params;
    refundApplyDAO.deleteById(params,(error,result)=>{
        if(error){
            logger.error('deleteById ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('deleteById ' + 'success');
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
                logger.info("updateRefundApplyMsg getById "+error.message);
                resUtil.resetFailedRes(res,error);
                reject(error);
            }else {
                if (rows.length > 0){
                    resolve();
                } else {
                    logger.info("updateRefundApplyMsg getById "+ sysMsg.ADMIN_PAYMENT_NO_MSG);
                    resUtil.resetFailedRes(res,sysMsg.ADMIN_PAYMENT_NO_MSG);
                    reject(error);
                }
            }
        })
    }).then(()=>{
        refundApplyDAO.updateById(params,(error,result)=>{
            if(error){
                logger.error('updateRefundApplyMsg updateById ' + error.message);
                resUtil.resInternalError(error, res, next);
            }else{
                logger.info('updateRefundApplyMsg updateById ' + 'success');
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
    const getPayment =()=>{
        return new Promise((resolve, reject) => {
            paymentDAO.getById(params,(error,rows)=>{
                if(error){
                    logger.error('updateRefundStatus getPayment ' + error.message);
                    reject({err:error});
                }else{
                    if (rows && rows.length>0) {
                        logger.info(' updateRefundStatus getPayment ' + 'success ');
                        if (rows[0].total_fee < params.refundFee) {
                            resUtil.resetFailedRes(res, sysMsg.ADMIN_PAYMENT_REFUND_PRICE);
                            reject(error);
                        } else {
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
                    }else{
                        logger.error('updateRefundStatus getPayment ' + sysMsg.ADMIN_PAYMENT_REFUND_PRICE);
                        resUtil.resetFailedRes(res, sysMsg.ADMIN_PAYMENT_REFUND_PRICE);
                        reject({msg:sysMsg.ADMIN_PAYMENT_REFUND_PRICE})
                    }
                }
            })
        });
    }
    const getPaymentType =()=>{
        return new Promise((resolve, reject) => {
            params.totalFee = 0 - params.refundFee;
            params.dateId = moment(new Date()).format('YYYYMMDD');
            params.status = sysConst.PAYMENT.status.paid;
            params.type = sysConst.PAYMENT.type.refund;
            params.dateId = moment().format("YYYYMMDD");
            logger.info(' updateRefundStatus getPaymentType paymentType:' + paymentType);
            if (paymentType == sysConst.PAYMENT.paymentType.wechat){
                wechatRefundApply();
            }else{
                bankRefundApply();
            }
        });
    }
    const wechatRefundApply =()=>{
        return new Promise(() => {
            params.paymentType = sysConst.PAYMENT.paymentType.wechat;
            const getPayment =()=>{
                return new Promise((resolve, reject) => {
                    paymentDAO.getPaymentByOrderId({orderId:params.orderId,type:1,status:1},(error,rows)=>{
                        if(error){
                            logger.error('updateRefundStatus wechatRefundApply getPayment ' + error.message);
                            reject({err:error});
                        }else{
                            if(rows && rows.length < 1){
                                logger.warn('updateRefundStatus wechatRefundApply getPayment ' + 'Please check the payment information! ');
                                reject({msg:sysMsg.ADMIN_PAYMENT_NO_MSG});
                            }else{
                                logger.info(' updateRefundStatus wechatRefundApply getPayment ' + 'success ');
                                params.totalFee = rows[0].total_fee;
                                params.paymentId = rows[0].id;
                                params.wxOrderId = rows[0].wx_order_id;
                                params.userId = rows[0].user_id;
                                resolve();
                            }
                        }
                    })
                });
            }
            const addRefundInfo =()=>{
                return new Promise((resolve, reject) => {
                    params.type = sysConst.PAYMENT.type.refund;
                    params.paymentType = sysConst.PAYMENT.paymentType.wechat;
                    //添加退款的panmen_inf
                    paymentDAO.addWechatRefund(params,(error,result)=>{
                        if(error){
                            logger.error('updateRefundStatus wechatRefundApply addRefundInfo ' + error.message);
                            resUtil.resInternalError(error, res, next);
                        }else{
                            logger.info('updateRefundStatus wechatRefundApply addRefundInfo '+' success');
                            params.refundId = result.insertId;
                            resolve();
                        }
                     });
                });
            }
            const wechatReq =()=>{
                return new Promise((resolve, reject) => {
                    wechatUtil.wechatRequest(params,(error,result)=>{
                        if (error){
                            logger.error('updateRefundStatus wechatRefundApply wechatReq ' + error.message);
                            reject({err:error});
                        }else {
                            logger.info('updateRefundStatus wechatRefundApply wechatReq ' + 'success');
                            if (result.return_code == 'FAIL') {
                                paymentDAO.delRefundFail(params, (error, result) => {
                                });
                                logger.warn('Refund failure!');
                                logger.warn(result);
                                resUtil.resetFailedRes(res, result, null);
                            } else {
                                //退款成功
                                params.status = sysConst.REFUND_STATUS.refunded;
                                //更新退款申请信息
                                refundApplyDAO.updateRefund(params, (error, result) => {
                                    if (error) {
                                        logger.error('updateRefundStatus wechatRefundApply wechatReq updateRefund ' + error.message);
                                        //resUtil.resInternalError(error, res, next);
                                        reject({err:error});
                                    } else {
                                        logger.info('updateRefundStatus wechatRefundApply wechatReq updateRefund ' + 'success');
                                        // resolve();
                                    }
                                });
                                resUtil.resetQueryRes(res, result, null);
                            }//result success
                        }//error else
                    });
                });
            }

            getPayment()
                .then(addRefundInfo)
                .then(wechatReq)
                .catch((reject)=>{
                    if(reject.err){
                        resUtil.resetFailedRes(res,reject.err);
                    }else{
                        resUtil.resetFailedRes(res,reject.msg);
                    }
                })
        })
    }
    const bankRefundApply =()=>{
        return new Promise(() => {
            params.paymentType = sysConst.PAYMENT.paymentType.bankTransfer;
            const addRefund =()=>{
                return new Promise((resolve, reject) => {
                    paymentDAO.addRefundPayment(params,(error,rows)=> {
                        if (error) {
                            logger.error('updateRefundStatus bankRefundApply addRefund ' + error.message);
                            resUtil.resInternalError(error, res, next);
                            reject(error);
                        } else {
                            logger.info('updateRefundStatus bankRefundApply addRefund ' + 'success');
                            params.paymentRefundId = rows.insertId;
                            resolve();
                        }
                    });
                });
            }
            const updateRefund =()=>{
                return new Promise((resolve, reject) => {
                    params.status = sysConst.REFUND_STATUS.refunded;
                    //更新退款申请信息
                    refundApplyDAO.updateRefund(params,(error,result)=>{
                        if(error){
                            logger.error('updateRefundStatus bankRefundApply updateRefund ' + error.message);
                            reject({err:error});
                        }else{
                            logger.info('updateRefundStatus bankRefundApply updateRefund ' + 'success');
                            resolve();
                        }
                    });
                });
            }
            const getOrderPaymentInfo =()=>{
                return new Promise((resolve, reject) => {
                    //获取支付信息
                    paymentDAO.getRealPaymentPrice(params, (error, rows) => {
                        if (error) {
                            logger.error('updateRefundStatus bankRefundApply getOrderPaymentInfo ' + error.message);
                            reject({err:error});
                        } else {
                            logger.info('updateRefundStatus bankRefundApply getOrderPaymentInfo ' + 'success');
                            params.realPaymentPrice = rows[0].pay_price - Math.abs(rows[0].refund_price) ;
                            resolve();
                        }
                    })
                });
            }
            const updateOrderInfo =()=>{
                return new Promise((resolve, reject) => {
                    //更新订单支付金额
                    orderInfoDAO.updateRealPaymentPrice(params, (error, result) => {
                        if (error) {
                            logger.error('updateRefundStatus bankRefundApply updateOrderInfo ' + error.message);
                            reject({err:error});
                        } else {
                            logger.info('updateRefundStatus bankRefundApply updateOrderInfo ' + 'success');
                            resUtil.resetUpdateRes(res, result, null);
                            return next();
                        }
                    })
                })
            }
            addRefund()
                .then(updateRefund)
                .then(getOrderPaymentInfo)
                .then(updateOrderInfo)
                .catch((reject)=>{
                    if(reject.err){
                        resUtil.resetFailedRes(res,reject.err);
                    }else{
                        resUtil.resetFailedRes(res,reject.msg);
                    }
                })
        });
    }
    getPayment()
        .then(getPaymentType)
        .catch((reject)=>{
            if(reject.err){
                resUtil.resetFailedRes(res,reject.err);
            }else{
                resUtil.resetFailedRes(res,reject.msg);
            }
        })
}
const refundInMonth = (req,res,next)=>{
    let params = req.params;
    params.dbMonth = moment().format("YYYYMM");
    params.status = sysConst.REFUND_STATUS.applying;
    refundApplyDAO.statisticsRefundPrice(params,(error,result)=>{
        if(error){
            logger.error('refundInMonth statisticsRefundPrice ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('refundInMonth statisticsRefundPrice ' + 'success');
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
    updateRefundApplyMsg
}