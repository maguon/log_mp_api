'use strict';

const fs = require('fs');
const xml2js = require('xml2js');
const https = require('https');
const encrypt = require('../util/Encrypt.js');
const moment = require('moment/moment.js');
const sysConfig = require("../config/SystemConfig");
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('WechatUti.js');


const wechatPaymentRequest =(params,callback)=>{
    let xmlParser = new xml2js.Parser({explicitArray : false, ignoreAttrs : true});
    let result = getPaymentParams(params);
    let httpsReq = https.request(result.options,(result)=>{
        let data = "";
        result.on('data',(d)=>{
            data += d;
        }).on('end',()=>{
            xmlParser.parseString(data,(err,result)=>{
                //将返回的结果再次格式化
                let resString = JSON.stringify(result);
                let evalJson = eval('(' + resString + ')');
                evalJson.xml.resString = resString;
                return callback(null,evalJson.xml);
                logger.info(" wechatPaymentRequest paymentResult"+resString);
            });
        }).on('error', (e)=>{
            logger.info('wechatPaymentRequest result '+ e.message);
            return callback(e,null);
        });
    });
    httpsReq.write(result.reqBody,"utf-8");
    httpsReq.end();
    httpsReq.on('error',(e)=>{
        logger.info('wechatPaymentRequest httpsReq '+ e.message);
        return callback(e,null);
    });
}
const getPaymentParams =(params)=>{
    let ourString = encrypt.randomString();
    params.nonceStr = ourString;
    let result = {};
    let body = 'test';
    let jsa = 'JSAPI';
    let signStr =
        "appid="+sysConfig.wechatConfig.mpAppId
        + "&body="+body
        + "&mch_id="+sysConfig.wechatConfig.mchId
        + "&nonce_str="+params.nonceStr
        + "&notify_url="+sysConfig.wechatConfig.notifyUrl//回调路径
        + "&openid="+params.openid
        + "&out_trade_no="+params.wxOrderId
        + "&spbill_create_ip="+ params.requestIp
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
        '<spbill_create_ip>'+ params.requestIp+'</spbill_create_ip>' +
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

const wechatRequest = (params,callback) => {
    let xmlParser = new xml2js.Parser({explicitArray : false, ignoreAttrs : true});
    let myDate = new Date();
    params.dateId = moment(myDate).format('YYYYMMDD');
    let refundResult = getRefundParams(params);
    //向微信请求
    let httpsReq = https.request(refundResult.options,(result)=>{
        let data = "";
        //返回结果
        result.on('data',(d)=>{
            data += d;
            logger.info("wechatRequest data:" + data);
        }).on('end',()=>{
            xmlParser.parseString(data,(err,result)=>{
                let resString = JSON.stringify(result);
                let evalJson = eval('(' + resString + ')');
                return callback(null,evalJson.xml);
            });
        }).on('error', (e)=>{
            logger.info('wechatRequest result '+ e.message);
            return callback(e,null);
        });
    });
    httpsReq.write(refundResult.reqBody,"utf-8");
    httpsReq.end();
    httpsReq.on('error',(e)=>{
        logger.info('wechatRequest httpsReq '+ e.message);
        return callback(e,null);
    });
}
const getRefundParams = (params)=>{
    let result = {};
    let refundUrl = sysConfig.wechatConfig.notifyUrl;
    let ourString = encrypt.randomString();
    params.nonceStr = ourString;
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
    result.reqBody = reqBody;
    result.options = options;
    logger.info('reqBody:' + reqBody);
    return result;
}
module.exports ={ wechatPaymentRequest,wechatRequest}