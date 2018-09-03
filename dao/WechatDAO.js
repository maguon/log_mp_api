'use strict'
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('WechatDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');

const getUserIdByCode = (params,callback) =>{
    const url = '/sns/jscode2session';
    const paramObj = {
        appid : sysConfig.wechatConfig.mpAppId,
        secret : sysConfig.wechatConfig.mpSecret,
        js_code : params.code,
        grant_type : 'authorization_code',
    }
    httpUtil.httpsGet(sysConfig.wechatConfig.mphost,443,url,paramObj,(err,res)=>{
        callback(err,res);
    })
}


module.exports = {
    getUserIdByCode
}