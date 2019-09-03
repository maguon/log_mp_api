'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('ProductOrderPayment.js');
const fs = require('fs');
const xml2js = require('xml2js');
const encrypt = require('../util/Encrypt.js');
const moment = require('moment/moment.js');
const https = require('https');
const sysConsts = require("../util/SystemConst");
const sysConfig = require("../config/SystemConfig");

const wechatPayment =(req,res,next)=>{
    let params = req.params;
    let ourString = encrypt.randomString();
    let productOrderId = params.orderId+"_"+encrypt.randomString(6);
    params.nonceStr = ourString;
    params.dateId = moment().format('YYYYMMDD');
    const getPayementStatus =()=>{
        return new Promise((resolve, reject) => {

        });
    }






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

module.exports = {
    wechatPayment
}