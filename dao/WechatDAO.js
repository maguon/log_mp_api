'use strict'
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('WechatDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');

const getUserIdByCode = (params,callback) => {
    const url = '/sns/jscode2session';
    const paramObj = {
        appid : sysConfig.wechatConfig.mpAppId,
        secret : sysConfig.wechatConfig.mpSecret,
        js_code : params.code,
        grant_type : 'authorization_code',
    }
    httpUtil.httpsGet(sysConfig.wechatConfig.mphost,443,url,paramObj,(err,res)=>{
        logger.debug('getUserIdByCode');
        callback(err,res);
    })
}
const unifiedOrder = (params,callback) => {
    const url = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
    const unifiedOrder = {
        appid: sysConfig.wechatConfig.mpAppId, //小程序ID	appid	是
        mch_id:600,//商户号	mch_id	是
        device_info:600,//设备号	device_info	否
        nonce_str:600,//随机字符串	nonce_str	是
        sign:600,//签名	sign	是
        sign_type:600,//签名类型	sign_type	否
        body:600,//商品描述	body	是
        detail:600,//商品详情	detail	否
        attach:600,//附加数据	attach	否
        out_trade_no:600,//商户订单号	out_trade_no	是
        fee_type:600,//标价币种	fee_type	否
        total_fee:params.totalFee,//标价金额	total_fee	是
        spbill_create_ip:600,//终端IP	spbill_create_ip	是
        time_start:600,//交易起始时间	time_start	否
        time_expire:600,//交易结束时间	time_expire	否
        goods_tag:600,//订单优惠标记	goods_tag	否
        notify_url:600,//通知地址	notify_url	是
        trade_type:600,//交易类型	trade_type	是
        product_id:600,//商品ID	product_id	否
        limit_pay:600,//指定支付方式	limit_pay	否
        openid:600//用户标识	openid	否
    }
    httpUtil.httpPost(sysConfig.wechatConfig.mphost,666,url,unifiedOrder,(err,rows)=>{
        logger.debug('unifiedOrder');
        callback(err,rows);
    })
}
const createUnifiedOrder = (params,callback) => {
    let query = "insert into wechat_unifiedorder(return_code,result_code,return_msg,appid,mch_id,device_info,nonce_str,sign,err_code,err_code_des,trade_type,prepay_id,code_url) values(?,?,?,?,?,?,?,?,?,?,?,?,? )";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.return_code;
    paramsArray[i++] = params.result_code;
    paramsArray[i++] = params.return_msg;
    paramsArray[i++] = params.appid;
    paramsArray[i++] = params.mch_id;
    paramsArray[i++] = params.device_info;
    paramsArray[i++] = params.nonce_str;
    paramsArray[i++] = params.sign;
    paramsArray[i++] = params.err_code;
    paramsArray[i++] = params.err_code_des;
    paramsArray[i++] = params.trade_type;
    paramsArray[i++] = params.prepay_id;
    paramsArray[i] = params.code_url;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('createUnifiedOrder');
        callback(error,rows);
    })
}
const orderQuery = (params,callback) => {
    const url = 'https://api.mch.weixin.qq.com/pay/orderquery';
    const orderQuery = {
        appid: sysConfig.wechatConfig.mpAppId,
        mch_id: params,
        transaction_id: params,
        out_trade_no: params,
        nonce_str: params,
        sign: params,
        sign_type: params
    }
    httpUtil.httpGet(sysConfig.wechatConfig.mphost,666,url,orderQuery,(err,res)=>{
        logger.debug('orderQuery');
        callback(err,res);
    })
}
const closeOrder = (params,callback) => {
    const url = 'https://api.mch.weixin.qq.com/pay/closeorder';
    const closeOrder = {
        appid: sysConfig.wechatConfig.mpAppId,
        mch_id: params,
        out_trade_no: params,
        nonce_str:params,
        sign:params,
        sign_type: params
    }
    httpUtil.httpPut(sysConfig.wechatConfig.mphost,666,url,closeOrder,(err,res)=>{
        logger.debug('closeOrder');
        callback(err,res);
    })
}
const refund = (params,callback) => {
    const url = 'https://api.mch.weixin.qq.com/secapi/pay/refund';
    const refund = {
        appid: sysConfig.wechatConfig.mpAppId,
        mch_id: params,
        nonce_str: params,
        sign: params,
        sign_type: params,
        transaction_id: params,
        out_trade_no: params,
        out_refund_no: params,
        total_fee: params,
        refund_fee: params,
        refund_fee_type: params,
        refund_desc: params,
        refund_account: params,
        notify_url: params
    }
    httpUtil.httpPost(sysConfig.wechatConfig.mphost,666,url,refund,(err,res)=>{
        logger.debug('refund');
        callback(err,res);
    })
}
const refundQuery = (params,callback) => {
    const url = 'https://api.mch.weixin.qq.com/pay/refundquery';
    const refundQuery = {
        appid: sysConfig.wechatConfig.mpAppId,
        mch_id: params,
        nonce_str: params,
        sign: params,
        sign_type: params,
        transaction_id: params,
        out_trade_no: params,
        out_refund_no: params,
        refund_id: params,
        offset: params
    }
    httpUtil.httpGet(sysConfig.wechatConfig.mphost,666,url,refundQuery,(err,res)=>{
        logger.debug('refundQuery');
        callback(err,res);
    })
}
module.exports = {
    getUserIdByCode,
    unifiedOrder,
    createUnifiedOrder,
    orderQuery,
    closeOrder,
    refund,
    refundQuery
}