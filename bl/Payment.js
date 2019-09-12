'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('Payment.js');
const paymentDAO = require('../dao/PaymentDAO.js');
const orderDAO = require('../dao/InquiryOrderDAO.js');
const productOrderPayment = require('../bl/ProductOrderPayment.js');
const fs = require('fs');
const xml2js = require('xml2js');
const encrypt = require('../util/Encrypt.js');
const moment = require('moment/moment.js');
const https = require('https');
const sysConsts = require("../util/SystemConst");
const sysConfig = require("../config/SystemConfig");
const refundApplyDAO = require('../dao/RefundApplyDAO.js');
const orderInfoDAO = require("../dao/InquiryOrderDAO");

const wechatRefund = (req,res,next)=>{
    let params = req.params;
    let ourString = encrypt.randomString();
    params.nonceStr = ourString;
    let xmlParser = new xml2js.Parser({explicitArray : false, ignoreAttrs : true});
    let refundUrl = 'https://stg.myxxjs.com/api/wechatRefund';
    let myDate = new Date();
    params.dateId = moment(myDate).format('YYYYMMDD');
    new Promise((resolve,reject)=>{
        paymentDAO.getPaymentByOrderId({orderId:params.orderId,type:1,status:1},(error,rows)=>{
            if(error){
                logger.error('wechatRefund getPaymentByOrderId ' + error.message);
                resUtil.resInternalError(error, res, next);
                reject(error);
            }else if(rows && rows.length < 1){
                logger.warn('wechatRefund getPaymentByOrderId ' + 'Please check the payment information!');
                resUtil.resetFailedRes(res,'请查看支付信息',null);
                reject(error);
            }else{
                logger.info('wechatRefund getPaymentByOrderId ' + 'success');
                params.totalFee = rows[0].total_fee;
                params.paymentId = rows[0].id;
                params.wxOrderId = rows[0].wx_order_id;
                params.userId = rows[0].user_id;
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            params.type = sysConsts.PAYMENT.type.refund;
            params.paymentType = sysConsts.PAYMENT.paymentType.wechat;
            params.refundFee = params.refundFee;
            paymentDAO.addWechatRefund(params,(error,result)=>{
                if(error){
                    logger.error('wechatRefund addWechatRefund ' + error.message);
                    resUtil.resInternalError(error, res, next);
                }else{
                    logger.info('wechatRefund addWechatRefund '+'success');
                    params.refundId = result.insertId;
                    let signStr =
                        "appid="+sysConfig.wechatConfig.mpAppId
                        + "&mch_id="+sysConfig.wechatConfig.mchId
                        + "&nonce_str="+params.nonceStr
                        + "&notify_url="+refundUrl
                        //+ "&openid="+params.openid
                        + "&out_refund_no="+params.refundId
                        + "&out_trade_no="+params.wxOrderId
                        + "&refund_fee="+ (-params.refundFee) * 100
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
                        '<refund_fee>'+(-params.refundFee) * 100+'</refund_fee>' +
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
                    let httpsReq = https.request(options,(result)=>{
                        let data = "";
                        logger.info(result);
                        result.on('data',(d)=>{
                            data += d;
                        }).on('end',()=>{
                            xmlParser.parseString(data,(err,result)=>{
                                let resString = JSON.stringify(result);
                                let evalJson = eval('(' + resString + ')');
                                logget.info("evalJson.xml.return_code:"+evalJson.xml.return_code);
                                if(evalJson.xml.return_code == 'FAIL'){
                                    paymentDAO.delRefundFail(params,(error,result)=>{});
                                    logger.warn('Refund failure!');
                                    resUtil.resetFailedRes(res,evalJson.xml,null)
                                }else if(evalJson.xml.result_code=='FAIL'){
                                    paymentDAO.delRefundFail(params,(error,result)=>{});
                                    logger.warn('Refund failure!');
                                    resUtil.resetFailedRes(res,evalJson.xml.err_code_des,null)
                                }
                                resUtil.resetQueryRes(res,evalJson.xml,null);
                            });
                            res.send(200,data);
                            return next();
                        }).on('error', (e)=>{
                            logger.info('wechatRefund result '+ e.message);
                            res.send(500,e);
                            return next();
                        });
                    });
                    httpsReq.write(reqBody,"utf-8");
                    httpsReq.end();
                    httpsReq.on('error',(e)=>{
                        logger.info('wechatRefund httpsReq '+ e.message);
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
const addWechatRefund=(req,res,next) => {
    let prepayIdJson = {
        status: 1
    };
    new Promise((resolve,reject)=>{
        logger.info("12345678910");
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

                //如果sysType==2,则跳转到商品订单退款
                let sysType =  parseInt(evalJsons.root.out_trade_no.split("_")[2]);
                if(sysType == sysConsts.SYSTEM_ORDER_TYPE.type.product){
                    productOrderPayment.productRefundPaymentCallback(result);
                    return next();
                }
            })
            //logger.info("addWechatRefund updateRefundSSS "+prepayIdJson);
            paymentDAO.updateRefund(prepayIdJson,(error,result)=>{
                if(error){
                    logger.error('addWechatRefund updateRefund ' + error.message);
                    // resUtil.resInternalError(error, res, next);
                    reject(error);
                }else{
                    logger.info('addWechatRefund updateRefund ' + 'success');
                    resolve();
                }
            });
        });
    }).then(()=>{
        paymentDAO.getPaymentById({paymentId:prepayIdJson.paymentId},(error,rows)=>{
            if(error){
                logger.error('addWechatRefund getPaymentById ' + error.message);
                resUtil.resInternalError(error, res, next);
            }else{
                logger.info('addWechatRefund getPaymentById ' + 'success');
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
                        logger.error('addWechatRefund updatePaymentRefundId ' + error.message);
                        resUtil.resInternalError(error, res, next);
                    } else {
                        logger.info('addWechatRefund updatePaymentRefundId ' + 'success');
                        new Promise((resolve,reject)=> {
                            paymentDAO.getOrderRealPayment({orderId:options.orderId}, (error, rows) => {
                                if (error) {
                                    logger.error('addWechatRefund getOrderRealPayment ' + error.message);
                                    resUtil.resInternalError(error, res, next);
                                    reject(error);
                                } else {
                                    logger.info('addWechatRefund getOrderRealPayment ' + 'success');
                                    options.realPaymentPrice = rows[0].real_payment;
                                    resolve();
                                }
                            })
                        }).then(()=>{
                            orderInfoDAO.updateRealPaymentPrice(options, (error, result) => {
                                if (error) {
                                    logger.error('addWechatRefund updateRealPaymentPrice ' + error.message);
                                    resUtil.resInternalError(error, res, next);
                                } else {
                                    logger.info('addWechatRefund updateRealPaymentPrice ' + 'success');
                                    resUtil.resetUpdateRes(res, result, null);
                                    // return next();
                                }
                            })
                        })
                    }
                })
            }
        });
    })

}
const getPayment = (req,res,next)=>{
    let params = req.params;
    params.unWxUnpaid = 0;
    paymentDAO.getPayment(params,(error,result)=>{
        if(error){
            logger.error('getPayment ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('getPayment ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
}
const getPaymentPrice = (req,res,next)=>{
    let params = req.params;
    paymentDAO.getPaymentPrice(params,(error,result)=>{
        if(error){
            logger.error('getPaymentPrice ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('getPaymentPrice ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
}
const getRefundByPaymentId=(req,res,next) => {
    let params = req.params;
    paymentDAO.getPayment(params,(error,rows)=>{
        if(error){
            logger.error('getRefundByPaymentId getPayment ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else if(rows[0].type && rows[0].type==1){
            paymentDAO.getRefundByPaymentId(params,(error,result)=>{
                if(error){
                    logger.error('getRefundByPaymentId ' + error.message);
                    resUtil.resInternalError(error, res, next);
                }else{
                    logger.info('getRefundByPaymentId ' + 'success');
                    resUtil.resetQueryRes(res,result,null);
                    return next();
                }
            });
        }else{
            paymentDAO.getPayment(params,(error,rows)=>{
                if(error){
                    logger.error('getRefundByPaymentId getPayment ' + error.message);
                    resUtil.resInternalError(error, res, next);
                }else{
                    params.pId = rows[0].p_id;
                    paymentDAO.getPaymentByRefundId(params,(error,result)=>{
                        if(error){
                            logger.error('getRefundByPaymentId getPaymentByRefundId ' + error.message);
                            resUtil.resInternalError(error, res, next);
                        }else{
                            logger.info('getRefundByPaymentId getPaymentByRefundId ' + 'success');
                            resUtil.resetQueryRes(res,result,null);
                            return next();
                        }
                    })
                }
            })
        }
    })
}
const updateRemark = (req,res,next)=>{
    let params = req.params;
    paymentDAO.updateRemark(params,(error,result)=>{
        if(error){
            logger.error('updateRemark ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('updateRemark ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
const addBankPayment = (req,res,next) => {
    let params = req.params;
    let myDate = new Date();
    params.dateId = moment(myDate).format('YYYYMMDD');
    new Promise((resolve,reject)=>{
        orderDAO.getOrder({orderId:params.orderId},(error,rows)=>{
            if(error){
                logger.error('addBankPayment getOrder ' + error.message);
                reject(error);
            }else if(rows && rows.length < 1){
                logger.warn('addBankPayment getOrder '+'No such order!');
                resUtil.resetFailedRes(res,'查无此订单',null);
            }else{
                logger.info('getOrder'+'success');
                params.orderId = rows[0].id;
                params.paymentType = 2;
                params.type = 1
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            params.dateId = moment().format("YYYYYMMDD");
            paymentDAO.addBankPayment(params,(error,result)=>{
                if(error){
                    logger.error('addBankPayment ' + error.message);
                    reject(error);
                }else{
                    logger.info('addBankPayment ' + 'success');
                    resUtil.resetCreateRes(res,result,null);
                    return next();
                }
            })
        })
    }).catch((error)=>{
        resUtil.resInternalError(error,res,next);
    })
}
const addBankPaymentByadmin = (req,res,next) => {
    let params = req.params;
    let myDate = new Date();
    params.dateId = moment(myDate).format('YYYYMMDD');
    new Promise((resolve,reject)=>{
        orderDAO.getOrder({orderId:params.orderId},(error,rows)=>{
            if(error){
                logger.error('addBankPaymentByadmin getOrder ' + error.message);
                reject(error);
            }else if(rows && rows.length < 1){
                logger.warn('addBankPaymentByadmin getOrder '+'No such order!');
                resUtil.resetFailedRes(res,'查无此订单',null);
            }else{
                logger.info('getOrder'+'success');
                params.orderId = rows[0].id;
                params.adminId = rows[0].admin_id;
                params.paymentType = 2;
                params.type = 1
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            params.dateId = moment().format("YYYYMMDD");
            paymentDAO.addBankPaymentByadmin(params,(error,result)=>{
                if(error){
                    logger.error('addBankPaymentByadmin ' + error.message);
                    reject(error);
                }else{
                    logger.info('addBankPaymentByadmin ' + 'success');
                    resUtil.resetCreateRes(res,result,null);
                    return next();
                }
            })
        })
    }).catch((error)=>{
        resUtil.resInternalError(error,res,next);
    })
}
const updateBankStatus = (req,res,next)=>{
    let params = req.params;
    let realPaymentPrice =0;
    new Promise((resolve,reject)=>{
        paymentDAO.getPaymentById(params,(error,rows)=>{
            if(error){
                logger.error('updateBankStatus getPaymentById ' + error.message);
                reject(error);
            }else{
                logger.info('updateBankStatus getPaymentById '+'success');
                if(rows.length >0){
                    let paymentType = rows[0].payment_type;
                    if (paymentType == sysConsts.PAYMENT.paymentType.bankTransfer) {
                        params.orderId = rows[0].order_id;
                        resolve();
                    }else {
                        logger.error('updateBankStatus updateTotalFee ' + sysMsg.ADMIN_PAYMENT_UPDATE_PERMISSION);
                        resUtil.resetUpdateRes(res,null,sysMsg.ADMIN_PAYMENT_UPDATE_PERMISSION);
                        reject(sysMsg.ADMIN_PAYMENT_UPDATE_PERMISSION);
                    }
                }else {
                    logger.error('updateBankStatus updateTotalFee ' + sysMsg.ADMIN_PAYMENT_NO_MSG);
                    resUtil.resetUpdateRes(res,null,sysMsg.ADMIN_PAYMENT_NO_MSG);
                    reject(sysMsg.ADMIN_PAYMENT_NO_MSG);
                }
            }
        })
    }).then(()=> {
        new Promise((resolve, reject) => {
            params.status = sysConsts.PAYMENT.status.paid;
            params.paymentType = sysConsts.PAYMENT.paymentType.bankTransfer;
            paymentDAO.updateBankStatus(params, (error, result) => {
                if (error) {
                    logger.error('updateBankStatus ' + error.message);
                    resUtil.resInternalError(error, res, next);
                    reject(error);
                } else {
                    logger.info('updateBankStatus ' + 'success');
                    resolve();
                }
            });
        }).then(() => {
            new Promise((resolve, reject) => {
                paymentDAO.getByOrderId(params, (error, rows) => {
                    if (error) {
                        logger.error('updateBankStatus getPaymentByOrderId ' + error.message);
                        resUtil.resInternalError(error, res, next);
                        reject(error);
                    } else {
                        logger.info('updateBankStatus getPaymentByOrderId ' + 'success');
                        for (let i in rows) {
                            realPaymentPrice += rows[i].total_fee;
                        }
                        resolve();
                    }
                });
            }).then(() => {
                params.realPaymentPrice = realPaymentPrice;
                orderDAO.updateRealPaymentPrice(params, (error, result) => {
                    if (error) {
                        logger.error('updateBankStatus updateRealPaymentPrice ' + error.message);
                        resUtil.resInternalError(error, res, next);
                    } else {
                        logger.info('updateBankStatus updateRealPaymentPrice ' + 'success');
                        resUtil.resetUpdateRes(res, result, null);
                        return next();
                    }
                });
            })
        })
    })

}
const addBankRefund = (req,res,next) => {
    let params = req.params;
    let myDate = new Date();
    params.dateId = moment(myDate).format('YYYYMMDD');
    new Promise((resolve,reject)=>{
        paymentDAO.getPayment(params,(error,rows)=>{
            if(error){
                logger.error('addBankRefund getPayment ' + error.message);
                reject(error);
            }else if(rows && rows.length < 1){
                logger.warn('addBankRefund getPayment '+'This information is not available!');
                resUtil.resetFailedRes(res,'查无此信息',null);
            }else{
                logger.info('addBankRefund getPayment '+'success');
                params.allFee = rows[0].total_fee;
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            paymentDAO.getAllRefund(params,(error,rows)=>{
                if(error){
                    logger.error('addBankRefund getAllRefund ' + error.message);
                    reject(error);
                }else if(rows && rows.length < 1){
                    logger.warn('addBankRefund getAllRefund '+'This information is not available!');
                    resUtil.resetFailedRes(res,'查无此信息',null);
                }else{
                    logger.info('addBankRefund getAllRefund '+'success');
                    params.allRefundFee = rows[0].refund_fee;
                    if(params.allFee + params.allRefundFee <= 0 && params.allRefundFee){
                        resUtil.resetFailedRes(res,'已经退款完成',null);
                        return next();
                    }
                    resolve();
                }
            })
        }).then(()=>{
            new Promise((resolve,reject)=>{
                paymentDAO.getPayment({orderId:params.orderId,type:1},(error,rows)=>{
                    if(error){
                        logger.error('addBankRefund getPayment ' + error.message);
                        reject(error);
                    }else if(rows && rows.length < 1){
                        logger.warn('addBankRefund getPayment '+'This information is not available!');
                        resUtil.resetFailedRes(res,'查无此信息',null);
                    }else{
                        logger.info('addBankRefund getPayment '+'success');
                        params.userId = rows[0].user_id;
                        params.bank = rows[0].bank;
                        params.bankCode = rows[0].bank_code;
                        params.accountName = rows[0].account_name;
                        params.paymentType = 2;
                        params.type = 0;
                        params.pId = rows[0].id;
                        resolve();
                    }
                })
            }).then(()=>{
                new Promise((resolve,reject)=>{
                    params.dateId = moment().format("YYYYMMDD");
                    paymentDAO.addBankRefund(params,(error,result)=>{
                        if(error){
                            logger.error('addBankRefund ' + error.message);
                            reject(error);
                        }else{
                            logger.info('addBankRefund '+'success');
                            resUtil.resetCreateRes(res,result,null);
                            return next();
                        }
                    })
                })
            })
        })
    }).catch((error)=>{
        resUtil.resInternalError(error,res,next);
    })
}
const updateRefundRemark = (req,res,next)=>{
    let params = req.params;
    paymentDAO.updateRefundRemark(params,(error,result)=>{
        if(error){
            logger.error('updateRefundRemark ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('updateRefundRemark ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
const updatePaymentById = (req,res,next) => {
    let params = req.params;
    let myDate = new Date();
    params.dateId = moment(myDate).format('YYYYMMDD');
    new Promise((resolve,reject)=>{
        orderDAO.getOrder({orderId:params.orderId},(error,rows)=>{
            if(error){
                logger.error('updatePaymentById getOrder ' + error.message);
                reject(error);
            }else if(rows && rows.length < 1){
                logger.warn('updatePaymentById getOrder '+'No such order!');
                resUtil.resetFailedRes(res,'查无此订单',null);
            }else{
                logger.info('updatePaymentById getOrder '+'success');
                params.orderId = rows[0].id;
                params.adminId = rows[0].admin_id;
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            paymentDAO.updatePaymentByadmin(params,(error,result)=>{
                if(error){
                    logger.error('updatePaymentById updatePaymentByadmin ' + error.message);
                    reject(error);
                }else{
                    logger.info('updatePaymentById updatePaymentByadmin ' + 'success');
                    resUtil.resetUpdateRes(res,result,null);
                    return next();
                }
            })
        })
    }).catch((error)=>{
        resUtil.resInternalError(error,res,next);
    })
}
const updateTotalFee = (req,res,next) => {
    let params = req.params;
    let myDate = new Date();

    params.dateId = moment(myDate).format('YYYYMMDD');
    new Promise((resolve,reject)=>{
        paymentDAO.getPaymentById(params,(error,rows)=>{
            if(error){
                logger.error('updateTotalFee getPaymentById ' + error.message);
                reject(error);
            }else{
                logger.info('updateTotalFee getPaymentById '+'success');
                if(rows.length >0){
                    let paymentType = rows[0].payment_type;
                    if (paymentType == sysConsts.PAYMENT.paymentType.bankTransfer) {
                        params.orderId = rows[0].order_id;
                        resolve();
                    }else {
                        logger.error('updateTotalFee updateTotalFee ' + sysMsg.ADMIN_PAYMENT_UPDATE_PERMISSION);
                        resUtil.resetUpdateRes(res,null,sysMsg.ADMIN_PAYMENT_UPDATE_PERMISSION);
                        reject(sysMsg.ADMIN_PAYMENT_UPDATE_PERMISSION);
                    }
                }else {
                    resUtil.resetUpdateRes(res,null,sysMsg.ADMIN_PAYMENT_NO_MSG);
                    reject(sysMsg.ADMIN_PAYMENT_NO_MSG);
                }
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            params.status = sysConsts.PAYMENT.status.paid;
            paymentDAO.updateTotalFee(params,(error,result)=>{
                if(error){
                    logger.error('updateTotalFee ' + error.message);
                    reject(error);
                }else{
                    logger.info('updateTotalFee ' + 'success');
                    resolve();
                }
            })
        }).then(()=>{
            updateOrderMsgByPrice(params,(error,result)=>{
                if (error){
                    logger.error('updateTotalFee updateOrderMsgByPrice ' + error.message);
                    resUtil.resInternalError(error, res, next);
                } else {
                    logger.info('updateTotalFee updateOrderMsgByPrice ' + 'success');
                    resUtil.resetUpdateRes(res,result,null);
                    return next();
                }
            })
        })
    }).catch((error)=>{
        resUtil.resInternalError(error,res,next);
    })
}
const updateOrderMsgByPrice = (params,callback)=>{
    let realPaymentPrice = 0;
    let paymentPrice =0;
    let totalPrice =0;
    new Promise((resolve,reject)=>{
        // params.status = sysConsts.PAYMENT.status.paid;
        paymentDAO.getRealPaymentPrice(params,(error,rows)=>{
            if(error){
                logger.error('updateOrderMsgByPrice getPaymentByOrderId ' + error.message);
                return callback(error,null);
            }else{
                logger.info('updateOrderMsgByPrice getPaymentByOrderId ' + 'success');
                realPaymentPrice = rows[0].pay_price - Math.abs(rows[0].refund_price);
                paymentPrice = rows[0].pay_price;
                resolve();
            }
        });
    }).then(()=>{
        new Promise((resolve,reject)=>{
            orderDAO.getById(params,(error,rows)=>{
                if(error){
                    logger.error('updateOrderMsgByPrice getById ' + error.message);
                    return callback(error,null);
                }else{
                    logger.info('updateOrderMsgByPrice getById ' + 'success');
                    totalPrice = rows[0].total_trans_price + rows[0].total_insure_price;
                    resolve();
                }
            })
        }).then(()=>{
            new Promise((resolve,reject)=>{
                if (totalPrice > paymentPrice ){
                    params.paymentStatus = sysConsts.ORDER.paymentStatus.partial;
                } else if (totalPrice <= paymentPrice){
                    params.paymentStatus = sysConsts.ORDER.paymentStatus.complete;
                }
                orderDAO.updateOrderPaymengStatusByOrderId(params,(error,result)=>{
                    if(error){
                        logger.error('updateOrderMsgByPrice updateOrderPaymengStatusByOrderId ' + error.message);
                        return callback(error,null);
                    }else{
                        logger.info('updateOrderMsgByPrice updateOrderPaymengStatusByOrderId ' + 'success');
                        resolve();
                    }
                });
            }).then(()=>{
                params.realPaymentPrice = realPaymentPrice;
                orderDAO.updateRealPaymentPrice(params,(error,result)=>{
                    if(error){
                        logger.error('updateOrderMsgByPrice updateRealPaymentPrice ' + error.message);
                        return callback(error,null);
                    }else{
                        logger.info('updateOrderMsgByPrice updateRealPaymentPrice ' + 'success');
                        return callback(null,result);
                    }
                });
            })
        })
    })
}
const deletePayment = (req,res,next)=>{
    let params = req.params;
    paymentDAO.deleteById(params,(error,result)=>{
        if(error){
            logger.error('deletePayment deleteById ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('deletePayment deleteById ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
const updateBankInfo = (req,res,next)=>{
    let params = req.params;
    paymentDAO.updateById(params,(error,result)=>{
        if(error){
            logger.error('updateBankInfo ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('updateBankInfo ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
const wechatPayment =(req,res,next)=>{
    let params = req.params;
    let ourString = encrypt.randomString();
    let orderId = params.orderId+"_"+encrypt.randomString(6)+"_" + sysConsts.SYSTEM_ORDER_TYPE.type.transport;
    params.nonceStr = ourString;
    let myDate = new Date();
    params.dateId = moment(myDate).format('YYYYMMDD');
    new Promise((resolve,reject)=>{
        orderDAO.getById({orderId:params.orderId},(error,rows)=>{
            if(error){
                logger.error('wechatPayment getById ' + error.message);
                resUtil.resInternalError(error, res, next);
                reject(error);
            }else{
                logger.info('wechatPayment getById ' + 'success');
                if (rows[0].payment_status == sysConsts.ORDER.paymentStatus.complete) {
                    resUtil.resetFailedRes(res,sysMsg.ORDER_PAYMENT_STATUS_COMPLETE);
                }else {
                    resolve();
                }
            }
        });
    }).then(()=>{
        new Promise((resolve,reject)=>{
            params.status = sysConsts.PAYMENT.status.unPaid;
            params.paymentType = sysConsts.PAYMENT.paymentType.wechat;
            params.type = sysConsts.PAYMENT.type.payment;
            params.dateId = moment().format("YYYYMMDD");
            params.wxOrderId = orderId;
            paymentDAO.addPayment(params,(error,result)=>{
                if(error){
                    logger.error('wechatPayment addPayment ' + error.message);
                    reject(error);
                }else if(result && result.insertId < 1){
                    logger.warn('wechatPayment addPayment '+'Failed to create payment information!');
                    resUtil.resetFailedRes(res,'创建支付信息失败',null);
                    reject(error);
                }else{
                    logger.info('wechatPayment addPayment '+'success');
                    resolve();
                }
            });
        }).then(()=>{
            let xmlParser = new xml2js.Parser({explicitArray : false, ignoreAttrs : true});
            let result = getParams(req,res,params);
            let httpsReq = https.request(result.options,(result)=>{
                let data = "";
                result.on('data',(d)=>{
                    data += d;
                }).on('end',()=>{
                    xmlParser.parseString(data,(err,result)=>{
                        //将返回的结果再次格式化
                        let resString = JSON.stringify(result);
                        let evalJson = eval('(' + resString + ')');
                        let myDate = new Date();
                        let myDateStr = myDate.getTime()/1000;
                        let parseIntDate = parseInt(myDateStr);
                        let paySignMD5 = encrypt.encryptByMd5NoKey('appId='+sysConfig.wechatConfig.mpAppId+'&nonceStr='+evalJson.xml.nonce_str+'&package=prepay_id='+evalJson.xml.prepay_id+'&signType=MD5&timeStamp='+parseIntDate+'&key=a7c5c6cd22d89a3eea6c739a1a3c74d1');
                        let paymentJson = [{
                            nonce_str: evalJson.xml.nonce_str,
                            prepay_id: evalJson.xml.prepay_id,
                            sign:evalJson.xml.sign,
                            timeStamp: parseIntDate,
                            paySign: paySignMD5,
                            resString:resString
                        }];
                        logger.info("paymentResult"+resString);
                        resUtil.resetQueryRes(res,paymentJson,null);
                    });
                    res.send(200,data);
                    return next();
                }).on('error', (e)=>{
                    logger.info('wechatPayment result '+ e.message);
                    res.send(500,e);
                    return next();
                });
            });
            httpsReq.write(result.reqBody,"utf-8");
            httpsReq.end();
            httpsReq.on('error',(e)=>{
                logger.info('wechatPayment httpsReq '+ e.message);
                res.send(500,e);
                return next();
            });
        })
    }).catch((error)=>{
        resUtil.resInternalError(error, res, next);
    })
}
const wechatPaymentCallback=(req,res,next) => {
    let xmlParser = new xml2js.Parser({explicitArray : false, ignoreAttrs : true});
    xmlParser.parseString(req.body,(err,result)=>{
        let resString = JSON.stringify(result);
        let evalJson = eval('(' + resString + ')');
        logger.info("req:" + req);
        logger.info("wechatPaymentCallback166"+resString);
        logger.info("wechatPaymentCallback1666"+req.body);
        if(evalJson.xml.req_info){
            let md5Key = encrypt.encryptByMd5NoKey(sysConfig.wechatConfig.paymentKey).toLowerCase();
            let reqInfo = evalJson.xml.req_info;
            let reqResult = encrypt.decryption(reqInfo,md5Key);

            xmlParser.parseString(reqResult,(err,result)=> {
                let resStrings = JSON.stringify(result);
                logger.info("wechatPaymentCallback1888"+ resStrings);
                let evalJsons = eval('(' + resStrings + ')');
                prepayIdJson.paymentId = evalJsons.root.out_refund_no;
                prepayIdJson.settlement_refund_fee = evalJsons.root.settlement_refund_fee / 100;
                prepayIdJson.wxOrderId = evalJsons.root.out_trade_no;
                //如果sysType==2,则跳转到商品订单退款
                let sysType =  parseInt(evalJsons.root.out_trade_no.split("_")[2]);
                if(sysType == sysConsts.SYSTEM_ORDER_TYPE.type.product){
                    productOrderPayment.productRefundPaymentCallback(result);
                    return next();
                }
            });
        }
        let sysType =  parseInt(evalJson.xml.out_trade_no.split("_")[2]);
        let sysOrderId =  parseInt(evalJson.xml.out_trade_no.split("_")[0]);
        logger.info("sysType:"+sysType);
        logger.info("sysOrderId:"+sysOrderId);
        logger.info(" evalJson.xml.total_fee / 100:"+ evalJson.xml.total_fee / 100);
        if(sysType == sysConsts.SYSTEM_ORDER_TYPE.type.product){
            let resultInfo = {
                body: req.body,
                result:result
            }

            productOrderPayment.productWechatPaymentCallback(resultInfo);
            return next();
        }
        let prepayIdJson = {
            nonceStr: evalJson.xml.nonce_str,
            openid: evalJson.xml.openid,
            orderId: parseInt(evalJson.xml.out_trade_no.split("_")[0]),
            transactionId: evalJson.xml.transaction_id,
            timeEnd: evalJson.xml.time_end,
            totalFee: evalJson.xml.total_fee / 100,
            status: sysConsts.PAYMENT.status.paid,
            type:sysConsts.PAYMENT.type.payment
        };
        new Promise((resolve,reject)=>{
            paymentDAO.getPaymentByOrderId({orderId:prepayIdJson.orderId},(error,rows)=>{
                if(error){
                    logger.error('wechatPaymentCallback getPaymentByOrderId ' + error.message);
                    reject();
                }else if(rows && rows.length < 1){
                    logger.warn('wechatPaymentCallback getPaymentByOrderId ' + 'This payment information is not available!');
                    resUtil.resetFailedRes(res,'没有此支付信息',null);
                }else{
                    prepayIdJson.paymentId = rows[0].id;
                    prepayIdJson.paymentType = rows[0].type;
                    resolve();
                }
            })
        }).then(()=>{
            new Promise((resolve,reject)=>{
                if (prepayIdJson.paymentType = sysConsts.PAYMENT.type.refund){
                    prepayIdJson.totalFee = -prepayIdJson.totalFee;
                }
                paymentDAO.updateWechatPayment(prepayIdJson,(error,result)=>{
                    if(error){
                        logger.error('wechatPaymentCallback updateWechatPayment ' + error.message);
                        reject(error);
                    }else{
                        logger.info('wechatPaymentCallback updateWechatPayment ' + 'success');
                        resolve();
                    }
                });
            }).then(()=>{
                let params ={
                    orderId: parseInt(evalJson.xml.out_trade_no.split("_")[0]),
                }
                updateOrderMsgByPrice(params,(error,result)=>{
                    if (error){
                        logger.error('wechatPaymentCallback updateOrderMsgByPrice ' + error.message);
                        resUtil.resInternalError(error, res, next);
                    } else {
                        logger.info('wechatPaymentCallback updateOrderMsgByPrice ' + 'success');
                        resUtil.resetUpdateRes(res,result,null);
                        return next();
                    }
                })
            })
        }).catch((error)=>{
            resUtil.resInternalError(error, res, next);
        })
    });
}
const getParams =(req,res,params)=>{
    let result = {};
    let body = 'test';
    let jsa = 'JSAPI';
    let requestIp = req.connection.remoteAddress.replace('::ffff:','');
    let signStr =
        "appid="+sysConfig.wechatConfig.mpAppId
        + "&body="+body
        + "&mch_id="+sysConfig.wechatConfig.mchId
        + "&nonce_str="+params.nonceStr
        + "&notify_url="+sysConfig.wechatConfig.notifyUrl//回调路径
        + "&openid="+params.openid
        + "&out_trade_no="+params.wxOrderId
        + "&spbill_create_ip="+requestIp
        + "&total_fee=" +params.totalFee * 100
        + "&trade_type="+jsa
        + "&key="+sysConfig.wechatConfig.paymentKey;
    let signByMd = encrypt.encryptByMd5NoKey(signStr);
    let reqBody =
        '<xml><appid>'+sysConfig.wechatConfig.mpAppId+'</appid>' +
        '<body>'+body+'</body>' +
        '<mch_id>'+sysConfig.wechatConfig.mchId+'</mch_id>' +
        '<nonce_str>'+params.nonceStr+'</nonce_str>' +
        '<notify_url>'+sysConfig.wechatConfig.notifyUrl+'</notify_url>' +
        '<openid>'+params.openid+'</openid>' +
        '<out_trade_no>'+params.wxOrderId+'</out_trade_no>' +
        '<spbill_create_ip>'+requestIp+'</spbill_create_ip>' +
        '<total_fee>'+params.totalFee * 100 + '</total_fee>' +
        '<trade_type>'+jsa+'</trade_type>' +
        '<sign>'+signByMd+'</sign></xml>';
    let url="/pay/unifiedorder";
    let options = {
        host: 'api.mch.weixin.qq.com',
        port: 443,
        path: url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length' : Buffer.byteLength(reqBody, 'utf8')
        }
    }
    result.reqBody = reqBody;
    result.options = options;
    return result;

}
const paymentInMonth =(req,res,next)=>{
    let params = req.params;
    params.dbMonth = moment().format("YYYYMM");
    paymentDAO.statisticsPaymentPrice(params,(error,result)=>{
        if(error){
            logger.error('paymentInMonth getPaymentInMonth ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('paymentInMonth getPaymentInMonth ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
}
module.exports = {
    wechatPaymentCallback,
    wechatRefund,
    addWechatRefund,
    getPayment,
    getRefundByPaymentId,
    updateRemark,
    addBankPayment,
    updateBankStatus,
    addBankRefund,
    updateRefundRemark,
    getPaymentPrice,
    addBankPaymentByadmin,
    updatePaymentById,
    updateTotalFee,
    deletePayment,
    updateBankInfo,
    wechatPayment,
    paymentInMonth
}