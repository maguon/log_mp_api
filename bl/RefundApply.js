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
const aaaa = (req,res,next)=>{
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
                params.dateId = moment().format("YYYYMMDD");
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
                let ourString = encrypt.randomString();
                params.nonceStr = ourString;
                let xmlParser = new xml2js.Parser({explicitArray : false, ignoreAttrs : true});
                let refundUrl = 'https://stg.myxxjs.com/api/wechatRefund';
                params.paymentType = sysConst.PAYMENT.paymentType.wechat;
                paymentDAO.addWechatRefund(params,(error,result)=>{
                    if(error){
                        logger.error('addWechatRefund' + error.message);
                        resUtil.resInternalError(error, res, next);
                    }else{
                        logger.info('addWechatRefund '+'success');
                        params.refundId = result.insertId;
                        let signStr =
                            "appid="+sysConfig.wechatConfig.mpAppId
                            + "&mch_id="+sysConfig.wechatConfig.mchId
                            + "&nonce_str="+params.nonceStr
                            + "&notify_url="+refundUrl
                            //+ "&openid="+params.openid
                            + "&out_refund_no="+params.refundId
                            + "&out_trade_no="+params.orderId
                            + "&refund_fee="+params.refundFee * 100
                            + "&total_fee=" +totalFee * 100
                            + "&key="+sysConfig.wechatConfig.paymentKey;
                        let signByMd = encrypt.encryptByMd5NoKey(signStr);
                        let reqBody =
                            '<xml><appid>'+sysConfig.wechatConfig.mpAppId+'</appid>' +
                            '<mch_id>'+sysConfig.wechatConfig.mchId+'</mch_id>' +
                            '<nonce_str>'+params.nonceStr+'</nonce_str>' +
                            '<notify_url>'+refundUrl+'</notify_url>' +
                            //'<openid>'+params.openid+'</openid>' +
                            '<out_refund_no>'+params.refundId+'</out_refund_no>' +
                            '<out_trade_no>'+params.orderId+'</out_trade_no>' +
                            '<refund_fee>'+params.refundFee * 100+'</refund_fee>' +
                            '<total_fee>'+totalFee * 100+'</total_fee>' +
                            '<sign>'+signByMd+'</sign></xml>';
                        let url="/secapi/pay/refund";
                        let certFile = fs.readFileSync(sysConfig.wechatConfig.paymentCert);
                        let options = {
                            host: 'api.mch.weixin.qq.com',
                            port: 443,
                            path: url,
                            method: 'POST',
                            pfx: certFile ,
                            passphrase : sysConfig.wechatConfig.mchId,
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Content-Length' : Buffer.byteLength(reqBody, 'utf8')
                            }
                        }
                        let httpsReq = https.request(options,(result)=>{
                            let data = "";
                            logger.info(result);
                            result.on('data',(d)=>{
                                data += d;
                            }).on('end',()=>{
                                xmlParser.parseString(data,(err,result)=>{
                                    let resString = JSON.stringify(result);
                                    let evalJson = eval('(' + resString + ')');
                                    if(evalJson.xml.return_code == 'FAIL'){
                                        paymentDAO.delRefundFail(params,(error,result)=>{});
                                        logger.warn('退款失败');
                                        resUtil.resetFailedRes(res,evalJson.xml,null)
                                        reject();
                                    }else if(evalJson.xml.result_code=='FAIL'){
                                        paymentDAO.delRefundFail(params,(error,result)=>{});
                                        logger.warn('退款失败');
                                        resUtil.resetFailedRes(res,evalJson.xml.err_code_des,null)
                                        reject();
                                    }
                                    // resUtil.resetQueryRes(res,evalJson.xml,null);
                                    resolve();
                                });
                                res.send(200,data);
                                return next();
                            }).on('error', (e)=>{
                                logger.info('wechatPayment '+ e.message);
                                res.send(500,e);
                                return next();
                            });
                        });
                        httpsReq.write(reqBody,"utf-8");
                        httpsReq.end();
                        httpsReq.on('error',(e)=>{
                            logger.info('wechatPayment '+ e.message);
                            res.send(500,e);
                            return next();
                        });
                    }
                })
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
                        resolve();
                    }
                })
            }
        }).then(()=>{
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
        })
    }).catch((error)=>{
        resUtil.resInternalError(error,res,next);
    })
}
module.exports = {
    addRefundApply,
    getRefundApply,
    updateRefuseStatus,
    updateRefundStatus,
    getRefundApplyStat,
    updateRefundById,
    deleteById,
    updateRefundApplyMsg
}