'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('Payment.js');
const paymentDAO = require('../dao/PaymentDAO.js');
const orderDAO = require('../dao/InquiryOrderDAO.js');
const fs = require('fs');
const xml2js = require('xml2js');
const encrypt = require('../util/Encrypt.js');
const moment = require('moment/moment.js');
const inquiryOrderDAO = require('../dao/InquiryOrderDAO.js');
const https = require('https');

const addWechatPayment = (req,res,next) => {
    let params = req.params;
    let xmlParser = new xml2js.Parser({explicitArray : false, ignoreAttrs : true});
    let body = 'test';
    let jsa = 'JSAPI';
    let ourString = encrypt.randomString();
    params.nonceStr = ourString;
    let myDate = new Date();
    params.dateId = moment(myDate).format('YYYYMMDD');
    let requestIp = req.connection.remoteAddress.replace('::ffff:','');
    new Promise((resolve,reject)=>{
        paymentDAO.getPaymentByOrderId({orderId:params.orderId,type:1},(error,rows)=>{
            if(error){
                logger.error('getPaymentByOrderId' + error.message);
                reject(error);
            }else if(rows && rows.length < 1){
                logger.warn('getPaymentByOrderId'+'查无此订单支付信息',null);
                resUtil.resetFailedRes(res,'查无此订单支付信息',null);
            }else{
                logger.info('getPaymentByOrderId'+'success');
                params.price = 0;
                for (let i = 0; i < rows.length; i++) {
                    params.price = params.price + rows[i].total_fee;
                }
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            inquiryOrderDAO.getOrder({orderId:params.orderId},(error,rows)=>{
                if(error){
                    logger.error('getOrder' + error.message);
                    reject(error);
                }else if(rows && rows.length < 1){
                    logger.warn('getOrder'+'查无此订单',null);
                    resUtil.resetFailedRes(res,'查无此订单',null);
                }else{
                    logger.info('getOrder'+'success');
                    params.totalFee = rows[0].total_trans_price + rows[0].total_insure_price - params.price;
                    params.type = 1;
                    params.payment_type = 1;
                    resolve();
                }
            })
        }).then(()=>{
            new Promise((resolve,reject)=>{
                paymentDAO.getPayment({orderId:params.orderId},(error,rows)=>{
                    if(error){
                        logger.error('getPayment' + error.message);
                        reject(error);
                    }else if(rows && rows.length > 0){
                        logger.warn('getPayment'+'已经生成该支付信息');
                        resUtil.resetQueryRes(res,{paymentId:rows[0].id},null);
                    }else{
                        logger.info('getPayment'+'success');
                        resolve();
                    }
                })
            }).then(()=>{
                new Promise((resolve,reject)=>{
                    paymentDAO.addPayment(params,(error,result)=>{
                        if(error){
                            logger.error('addPayment' + error.message);
                            reject(error);
                        }else if(result && result.insertId < 1){
                            logger.warn('addPayment'+'创建支付信息失败');
                            resUtil.resetFailedRes(res,'创建支付信息失败',null);
                        }else{
                            logger.info('addPayment'+'success');
                            resolve();
                        }
                    })
                }).then(()=>{
                    new Promise((resolve,reject)=>{
                        let signStr =
                            "appid="+sysConfig.wechatConfig.mpAppId
                            + "&body="+body
                            + "&mch_id="+sysConfig.wechatConfig.mchId
                            + "&nonce_str="+ourString
                            + "&notify_url="+sysConfig.wechatConfig.notifyUrl
                            + "&openid="+params.openid
                            + "&out_trade_no="+params.orderId
                            + "&spbill_create_ip="+requestIp
                            + "&total_fee=" +params.totalFee * 100
                            + "&trade_type="+jsa
                            + "&key="+sysConfig.wechatConfig.paymentKey;
                        let signByMd = encrypt.encryptByMd5NoKey(signStr);
                        let reqBody =
                            '<xml><appid>'+sysConfig.wechatConfig.mpAppId+'</appid>' +
                            '<body>'+body+'</body>' +
                            '<mch_id>'+sysConfig.wechatConfig.mchId+'</mch_id>' +
                            '<nonce_str>'+ourString+'</nonce_str>' +
                            '<notify_url>'+sysConfig.wechatConfig.notifyUrl+'</notify_url>' +
                            '<openid>'+params.openid+'</openid>' +
                            '<out_trade_no>'+params.orderId+'</out_trade_no>' +
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
                        let httpsReq = https.request(options,(result)=>{
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
                                        paySign: paySignMD5
                                    }];
                                    logger.info("paymentResult"+resString);
                                    resUtil.resetQueryRes(res,paymentJson,null);
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
                    })
                })
            })
        })
    }).catch((error)=>{
        resUtil.resInternalError(error,res,next);
    })
}
const updateWechatPayment=(req,res,next) => {
    let xmlParser = new xml2js.Parser({explicitArray : false, ignoreAttrs : true});
    xmlParser.parseString(req.body,(err,result)=>{
        let resString = JSON.stringify(result);
        let evalJson = eval('(' + resString + ')');
        logger.info("paymentResult166"+resString);
        logger.info("paymentResult1666"+req.body);
        let prepayIdJson = {
            nonceStr: evalJson.xml.nonce_str,
            openid: evalJson.xml.openid,
            orderId: evalJson.xml.out_trade_no,
            timeEnd: evalJson.xml.time_end,
            totalFee:evalJson.xml.total_fee / 100,
            status: 1,
            type:1
        };
        new Promise((resolve,reject)=>{
            paymentDAO.getPaymentByOrderId({orderId:prepayIdJson.orderId},(error,rows)=>{
                if(error){
                    logger.error('getPaymentByOrderId' + error.message);
                    reject();
                }else if(rows && rows.length < 1){
                    logger.warn('getPaymentByOrderId' + '没有此支付信息');
                    resUtil.resetFailedRes(res,'没有此支付信息',null);
                }else{
                    prepayIdJson.paymentId = rows[0].id;
                    resolve();
                }
            })
        }).then(()=>{
            new Promise((resolve,reject)=>{
                inquiryOrderDAO.updateOrderPaymengStatusByOrderId({orderId:prepayIdJson.orderId,paymentStatus:1},(error,result)=>{
                    if(error){
                        logger.error('updateOrderPaymengStatusByOrderId' + error.message);
                        reject();
                    }else if(result && result < 1){
                        logger.warn('updateOrderPaymengStatusByOrderId' + '修改订单支付状态失败');
                        resUtil.resetFailedRes(res,'修改订单支付状态失败',null);
                    }else{
                        logger.info('updateOrderPaymengStatusByOrderId'+'success');
                        resolve();
                    }
                });
            }).then(()=>{
                new Promise((resolve,reject)=>{
                    paymentDAO.updateWechatPayment(prepayIdJson,(error,result)=>{
                        if(error){
                            logger.error('updateWechatPayment' + error.message);
                            reject();
                        }else{
                            logger.info('updateWechatPayment' + 'success');
                            resUtil.resetCreateRes(res,result,null);
                            return next();
                        }
                    });
                })
            })
        }).catch((error)=>{
            resUtil.resInternalError(error, res, next);
        })
    });
}
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
                logger.error('getPaymentByOrderId' + error.message);
                resUtil.resInternalError(error, res, next);
            }else if(rows && rows.length < 1){
                logger.warn('getPaymentByOrderId' + '请查看支付信息');
                resUtil.resetFailedRes(res,'请查看支付信息',null);
            }else{
                logger.info('getPaymentByOrderId' + 'success');
                params.totalFee = rows[0].total_fee;
                params.paymentId = rows[0].id;
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
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
                        + "&total_fee=" +params.totalFee * 100
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
                                if(evalJson.xml.return_code == 'FAIL'){
                                    paymentDAO.delRefundFail(params,(error,result)=>{});
                                    logger.warn('退款失败');
                                    resUtil.resetFailedRes(res,evalJson.xml,null)
                                }else if(evalJson.xml.result_code=='FAIL'){
                                    paymentDAO.delRefundFail(params,(error,result)=>{});
                                    logger.warn('退款失败');
                                    resUtil.resetFailedRes(res,evalJson.xml.err_code_des,null)
                                }
                                resUtil.resetQueryRes(res,evalJson.xml,null);
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
        })
    }).catch((error)=>{
        resUtil.resInternalError(error, res, next);
    })
};
const addWechatRefund=(req,res,next) => {
    let xmlParser = new xml2js.Parser({explicitArray : false, ignoreAttrs : true});
    xmlParser.parseString(req.body,(err,result)=>{
        let resString = JSON.stringify(result);
        let evalJson = eval('(' + resString + ')');
        let prepayIdJson = {
            status: 1
        };
        let md5Key = encrypt.encryptByMd5NoKey(sysConfig.wechatConfig.paymentKey).toLowerCase();
        let reqInfo = evalJson.xml.req_info;
        let reqResult = encrypt.decryption(reqInfo,md5Key);
        xmlParser.parseString(reqResult,(err,result)=>{
            let resStrings = JSON.stringify(result);
            let evalJsons = eval('(' + resStrings + ')');
            prepayIdJson.refundId = evalJsons.root.out_refund_no;
            prepayIdJson.settlement_refund_fee = evalJsons.root.settlement_refund_fee / 100;
        })
        logger.info("updateRefundSSS"+prepayIdJson);
        paymentDAO.updateRefund(prepayIdJson,(error,result)=>{
            if(error){
                logger.error('updateRefund' + error.message);
                resUtil.resInternalError(error, res, next);
            }else{
                logger.info('updateRefund' + 'success');
                resUtil.resetCreateRes(res,result,null);
                return next();
            }
        });
    });
}
const getPayment = (req,res,next)=>{
    let params = req.params;
    paymentDAO.getPayment(params,(error,result)=>{
        if(error){
            logger.error('getPayment' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('getPayment' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
}
const getPaymentPrice = (req,res,next)=>{
    let params = req.params;
    paymentDAO.getPaymentPrice(params,(error,result)=>{
        if(error){
            logger.error('getPaymentPrice' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('getPaymentPrice' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
}
const getRefundByPaymentId=(req,res,next) => {
    let params = req.params;
    paymentDAO.getPayment(params,(error,rows)=>{
        if(error){
            logger.error('getPayment' + error.message);
            resUtil.resInternalError(error, res, next);
        }else if(rows[0].type && rows[0].type==1){
            paymentDAO.getRefundByPaymentId(params,(error,result)=>{
                if(error){
                    logger.error('getRefundByPaymentId' + error.message);
                    resUtil.resInternalError(error, res, next);
                }else{
                    logger.info('getRefundByPaymentId' + 'success');
                    resUtil.resetQueryRes(res,result,null);
                    return next();
                }
            });
        }else{
            paymentDAO.getPayment(params,(error,rows)=>{
                if(error){
                    logger.error('getPayment' + error.message);
                    resUtil.resInternalError(error, res, next);
                }else{
                    params.pId = rows[0].p_id;
                    paymentDAO.getPaymentByRefundId(params,(error,result)=>{
                        if(error){
                            logger.error('getPaymentByRefundId' + error.message);
                            resUtil.resInternalError(error, res, next);
                        }else{
                            logger.info('getPaymentByRefundId' + 'success');
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
            logger.error('updateRemark' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('updateRemark' + 'success');
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
                logger.error('getOrder' + error.message);
                reject(error);
            }else if(rows && rows.length < 1){
                logger.warn('getOrder'+'查无此订单');
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
            paymentDAO.addBankPayment(params,(error,result)=>{
                if(error){
                    logger.error('addBankPayment' + error.message);
                    reject(error);
                }else{
                    logger.info('addBankPayment' + 'success');
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
                logger.error('getOrder' + error.message);
                reject(error);
            }else if(rows && rows.length < 1){
                logger.warn('getOrder'+'查无此订单');
                resUtil.resetFailedRes(res,'查无此订单',null);
            }else{
                logger.info('getOrder'+'success');
                params.orderId = rows[0].id;
                params.userId = rows[0].user_id;
                params.paymentType = 2;
                params.type = 1
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            paymentDAO.addBankPaymentByadmin(params,(error,result)=>{
                if(error){
                    logger.error('addBankPaymentByadmin' + error.message);
                    reject(error);
                }else{
                    logger.info('addBankPaymentByadmin' + 'success');
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
    paymentDAO.updateBankStatus(params,(error,result)=>{
        if(error){
            logger.error('updateBankStatus' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('updateBankStatus' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
const addBankRefund = (req,res,next) => {
    let params = req.params;
    let myDate = new Date();
    params.dateId = moment(myDate).format('YYYYMMDD');
    new Promise()
    new Promise((resolve,reject)=>{
        paymentDAO.getPayment({orderId:params.orderId,type:1},(error,rows)=>{
            if(error){
                logger.error('getPayment' + error.message);
                reject(error);
            }else if(rows && rows.length < 1){
                logger.warn('getPayment'+'查无此信息');
                resUtil.resetFailedRes(res,'查无此信息',null);
            }else{
                logger.info('getPayment'+'success');
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
            paymentDAO.addBankRefund(params,(error,result)=>{
                if(error){
                    logger.error('addBankRefund' + error.message);
                    reject(error);
                }else{
                    logger.info('addBankRefund'+'success');
                    resUtil.resetCreateRes(res,result,null);
                    return next();
                }
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
            logger.error('updateRefundRemark' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('updateRefundRemark' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
module.exports = {
    addWechatPayment,
    updateWechatPayment,
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
    addBankPaymentByadmin
}