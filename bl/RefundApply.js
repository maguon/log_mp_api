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
                wechatRefund(req,res,next);
            } else {
                params.paymentType = sysConst.PAYMENT.paymentType.bankTransfer;
                //添加退款信息
                paymentDAO.addRefundPayment(params,(error,rows)=>{
                    if(error){
                        logger.error('addRefundPayment' + error.message);
                        resUtil.resInternalError(error, res, next);
                        reject(error);
                    }else{
                        //添加成功之
                        logger.info('addRefundPayment' + 'success');
                        params.paymentRefundId = rows.insertId;
                        new Promise((resolve,reject)=>{
                            params.status = sysConst.REFUND_STATUS.refunded;
                            //params.refundFee = params.refundFee;
                            //更新退款申请信息
                            refundApplyDAO.updateRefund(params,(error,result)=>{
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
                                //获取付款信息
                                paymentDAO.getRealPaymentPrice(params, (error, rows) => {
                                    if (error) {
                                        logger.error('getRealPaymentPrice' + error.message);
                                        resUtil.resInternalError(error, res, next);
                                        reject(error);
                                    } else {
                                        logger.info('getRealPaymentPrice' + 'success');
                                        params.realPaymentPrice = rows[0].pay_price - Math.abs(rows[0].refund_price) ;
                                        resolve();
                                    }
                                })
                            }).then(()=>{
                                //更新订单支付金额
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
                    }
                })
            }
        })
    }).catch((error)=>{
        resUtil.resInternalError(error,res,next);
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
const wechatRefund = (req,res,next)=>{
    let params = req.params;
    let ourString = encrypt.randomString();
    params.nonceStr = ourString;
    let xmlParser = new xml2js.Parser({explicitArray : false, ignoreAttrs : true});
    //let refundUrl = 'https://stg.myxxjs.com/api/wechatRefund';
    let refundUrl = sysConfig.wechatConfig.notifyUrl;
    let myDate = new Date();
    params.dateId = moment(myDate).format('YYYYMMDD');
    new Promise((resolve,reject)=>{
        //获取支付信息
        paymentDAO.getPaymentByOrderId({orderId:params.orderId,type:1,status:1},(error,rows)=>{
            if(error){
                logger.error('getPaymentByOrderId' + error.message);
                resUtil.resInternalError(error, res, next);
                reject(error);
            }else if(rows && rows.length < 1){
                logger.warn('getPaymentByOrderId' + '请查看支付信息');
                resUtil.resetFailedRes(res,'请查看支付信息',null);
                reject(error);
            }else{
                logger.info('getPaymentByOrderId' + 'success');
                params.totalFee = rows[0].total_fee;
                params.paymentId = rows[0].id;
                params.wxOrderId = rows[0].wx_order_id;
                params.userId = rows[0].user_id;
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            params.type = sysConst.PAYMENT.type.refund;
            params.paymentType = sysConst.PAYMENT.paymentType.wechat;
            //添加退款的panmen_info
            paymentDAO.addWechatRefund(params,(error,result)=>{
                if(error){
                    logger.error('addWechatRefund' + error.message);
                    resUtil.resInternalError(error, res, next);
                }else{
                    //成功添加退款信息
                    logger.info('addWechatRefund '+'success');
                    params.refundId = result.insertId;
                    let signStr =
                        "appid="+sysConfig.wechatConfig.mpAppId
                        + "&mch_id="+sysConfig.wechatConfig.mchId
                        + "&nonce_str="+params.nonceStr
                        + "&notify_url="+refundUrl
                        //+ "&openid="+params.openid
                        + "&out_refund_no="+params.refundId
                        + "&out_trade_no="+params.wxOrderId
                        + "&refund_fee="+ params.refundFee * 100
                        + "&total_fee=" +params.totalFee * 100
                        + "&key="+sysConfig.wechatConfig.paymentKey;
                    let signByMd = encrypt.encryptByMd5NoKey(signStr);
                    let reqBody =
                        '<xml><appid>'+sysConfig.wechatConfig.mpAppId+'</appid>' +
                        '<mch_id>'+sysConfig.wechatConfig.mchId+'</mch_id>' +
                        '<nonce_str>'+params.nonceStr+'</nonce_str>' +
                        '<notify_url>'+refundUrl+'</notify_url>' +
                        //'<openid>'+params.openid+'</openid>' +
                        '<out_refund_no>'+params.refundId +'</out_refund_no>' +
                        '<out_trade_no>'+params.wxOrderId +'</out_trade_no>' +
                        '<refund_fee>'+params.refundFee * 100+'</refund_fee>' +
                        '<total_fee>'+params.totalFee * 100+'</total_fee>' +
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
                    //向微信请求
                    let httpsReq = https.request(options,(result)=>{
                        let data = "";
                        //logger.info(result);
                        //返回结果
                        result.on('data',(d)=>{
                            data += d;
                        }).on('end',()=>{
                            xmlParser.parseString(data,(err,result)=>{
                                let resString = JSON.stringify(result);
                                let evalJson = eval('(' + resString + ')');
                                if(evalJson.xml.return_code == 'FAIL'){
                                    paymentDAO.delRefundFail(params,(error,result)=>{});
                                    logger.warn('退款失败');
                                    logger.warn(evalJson.xml);
                                    resUtil.resetFailedRes(res,evalJson.xml,null);
                                }else {
                                    //退款成功
                                    logger.info('addWechatRefund' + 'success');
                                    params.paymentRefundId = rows.insertId;
                                    new Promise((resolve,reject)=>{
                                        params.status = sysConst.REFUND_STATUS.refunded;
                                        //params.refundFee = params.refundFee;
                                        //更新退款申请信息
                                        refundApplyDAO.updateRefund(params,(error,result)=>{
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
                                            //获取付款信息
                                            paymentDAO.getRealPaymentPrice(params, (error, rows) => {
                                                if (error) {
                                                    logger.error('getRealPaymentPrice' + error.message);
                                                    resUtil.resInternalError(error, res, next);
                                                    reject(error);
                                                } else {
                                                    logger.info('getRealPaymentPrice' + 'success');
                                                    params.realPaymentPrice = rows[0].pay_price - Math.abs(rows[0].refund_price) ;
                                                    resolve();
                                                }
                                            })
                                        }).then(()=>{
                                            //更新订单支付金额
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
                                    resUtil.resetQueryRes(res,evalJson.xml,null);
                                }
                                return next();

                            });

                        }).on('error', (e)=>{
                            logger.info('wechatPayment '+ e.message);
                            resUtil.resInternalError(e, res, next);
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
        })
    }).catch((error)=>{
        resUtil.resInternalError(error, res, next);
    })
};
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