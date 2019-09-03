'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('ProductOrderPayment.js');
const productOrderDAO = require('../dao/ProductOrderDAO.js');
const productPaymentDAO = require('../dao/ProductPaymentDAO.js');
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
    let wx_productOrderId = params.productOrderId+"_"+encrypt.randomString(6);
    params.nonceStr = ourString;
    params.dateId = moment().format('YYYYMMDD');
    const getPayementStatus =()=>{
        return new Promise((resolve, reject) => {
            productOrderDAO.getUserProductOrder({orderId:params.productOrderId},(error,rows)=>{
                if(error){
                    logger.error('wechatPayment getPayementStatus ' + error.message);
                    resUtil.resInternalError(error, res, next);
                    reject({err:error});
                }else{
                    logger.info('wechatPayment getPayementStatus ' + 'success');
                    if (rows[0].payment_status == sysConsts.PRODUCT_ORDER.payment_status.complete) {
                        reject(res,{msg:sysMsg.ORDER_PAYMENT_STATUS_COMPLETE});
                    }else {
                        resolve();
                    }
                }
            });
        });
    }
    const addPamentInfo =()=>{
        return new Promise((resolve, reject) => {
            params.status = sysConsts.PRODUCT_PAYMENT.status.unPaid;//未付款
            params.type = sysConsts.PRODUCT_PAYMENT.type.payment;//支付
            params.dateId = moment().format("YYYYMMDD");
            params.wxOrderId = wx_productOrderId;
            productPaymentDAO.addPayment(params,(error,result)=>{
                if(error){
                    logger.error('wechatPayment addPamentInfo ' + error.message);
                    reject(error);
                }else{
                    if(result && result.insertId < 1){
                        logger.warn('wechatPayment addPamentInfo '+'Failed to create payment information!');
                        resUtil.resetFailedRes(res,'创建支付信息失败',null);
                        reject(error);
                    }else{
                        logger.info('wechatPayment addPamentInfo '+'success');
                        resolve();
                    }
                }
            });
        });
    }
    const httpReques =()=>{
        return  new Promise((resolve, reject) => {
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
                        logger.info("wechatPayment httpReques "+resString);
                        resUtil.resetQueryRes(res,paymentJson,null);
                    });
                    res.send(200,data);
                    return next();
                }).on('error', (e)=>{
                    logger.info('wechatPayment httpReques result '+ e.message);
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
        });
    }
    getPayementStatus()
        .then(addPamentInfo)
        .then(httpReques)
        .catch((reject)=>{
            if(reject.err){
                resUtil.resetFailedRes(res,reject.err);
            }else{
                resUtil.resetFailedRes(res,reject.msg);
            }
        })
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
const getPayment = (req,res,next)=>{
    let params = req.params;
    params.unWxUnpaid = 0;
    productPaymentDAO.getPayment(params,(error,result)=>{
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
module.exports = {
    wechatPayment,
    getPayment
}