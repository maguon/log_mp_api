
const wechatDAO = require('../dao/WechatDAO.js');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('UserDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const getUser=(params,callback)=>{
    var query  = " select * from user_info where user_id is not null ";
    var paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and user_id = ? ";
    }
    if(params.userName){
        query = query + " and user_name like '%"+params.userName+"%'";
    }
    if(params.openid){
        paramsArray[i++] = params.openid;
        query = query + " and openid = ? ";
    }
    if(params.password){
        paramsArray[i++] = params.password;
        query = query + " and password = ? ";
    }
    if(params.gender){
        paramsArray[i++] = params.gender;
        query = query + " and gender = ? ";
    }
    if(params.start && params.end){
        paramsArray[i++] = params.start;
        paramsArray[i++] = params.end;
        query = query + " limit ? , ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getUser');
        callback(error,rows);
    });
}
const createUser = (params,callback)=>{
    var query = "insert into user_info (user_name,openid,gender,phone) values(?,?,?,?) ";
    var paramsArray = [],i=0;
    paramsArray[i++]=params.userName;
    paramsArray[i++]=params.openid;
    paramsArray[i++]=params.gender;
    paramsArray[i++]=params.phone;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('createUser');
        callback(error,rows);
    });
}
const updateUser=(params,callback)=>{
    var query = "update user_info set user_name=? ,gender=? where user_id = ? ";
    var paramsArray = [],i=0;
    paramsArray[i++] = params.userName;
    paramsArray[i++] = params.gender;
    paramsArray[i++] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateUser');
        callback(error,rows);
    });
}
const updatePassword=(params,callback)=>{
    var query = "update user_info set password = ? where user_id = ? ";
    var paramsArray = [],i=0;
    paramsArray[i++] = params.newPassword;
    paramsArray[i++] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updatePassword');
        callback(error,rows);
    });
}
const updatePhone=(params,callback)=>{
    var query = "update user_info set phone = ? where user_id = ? "
    var paramsArray = [],i=0;
    paramsArray[i++] = params.phone;
    paramsArray[i++] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updatePhone');
        callback(error,rows);
    });
}
const updateStatus=(params,callback)=>{
    var query = "update user_info set status = ? where user_id = ? ";
    var paramsArray =[],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i++] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateStatus');
        callback(error,rows);
    });
}
module.exports = {
    getUser,
    createUser,
    updateUser,
    updatePassword,
    updatePhone,
    updateStatus
}