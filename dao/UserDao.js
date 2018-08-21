
const wechatDAO = require('../dao/WechatDAO.js');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('UserDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const getUser=(params,callback)=>{
    var query  = " select * from user_info where openid is not null ";
    var paramsArray = [],i=0;

    if(params.openid){
        paramsArray[i++] = params.openid;
        query = query + " and openid = ? ";
    }

    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getUser');
        callback(error,rows);
    });
}
const createUser = (params,callback)=>{

    var query = "insert into user_info (user_name,openid,sex,phone) values(?,?,?,?) ";
    var paramsArray = [],i=0;
    paramsArray[i++]=params.userName;
    paramsArray[i++]=params.openid;
    paramsArray[i++]=params.sex;
    paramsArray[i++]=params.phone;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('createUser');
        callback(error,rows);
    });

}
/*const getUserIdByCode = (params,callback) =>{
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
}*/

module.exports = {
    getUser,
    createUser
}