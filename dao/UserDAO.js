'use strict'
const wechatDAO = require('../dao/WechatDAO.js');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('UserDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');
const encrypt = require('../util/Encrypt.js');

const getUser=(params,callback)=>{
    let query  = " select * from user_info where id is not null ";
    let paramsArray = [],i=0;
    if(params.wechatId){
        paramsArray[i++] = params.wechatId;
        query = query + " and wechat_id = ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getUser');
        callback(error,rows);
    });
}
const queryUser = (params,callback) => {
    var query = "select id,user_name,wechat_id,password,gender,phone,status from user_info where id is not null ";
    var paramsArray = [],i=0;
    if(params.id){
        paramsArray[i++] = params.id;
        query = query + " and id = ? ";
    }
    if(params.userName){
        query = query + " and user_name like '%"+params.userName+"%'";
    }
    if(params.wechatId){
        paramsArray[i++] = params.wechatId;
        query = query + " and wechat_id = ? ";
    }
    if(params.phone){
        paramsArray[i++] = params.phone;
        query = query + " and password = ? "
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + "and password = ? "
    }
    if(params.start && params.end){
        paramsArray[i++] = params.start;
        paramsArray[i++] = params.end;
        query = query + " limit ? , ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('queryUser');
        callback(error,rows);
    })
}
const createUser = (params,callback)=>{
    var query = "insert into user_info (user_name,wechat_id,gender,phone,password) values(?,?,?,?,?) ";
    var paramsArray = [],i=0;
    paramsArray[i++]=params.userName;
    paramsArray[i++]=params.wechatId;
    paramsArray[i++]=params.gender;
    paramsArray[i++]=params.phone;
    paramsArray[i++]=params.password;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('createUser');
        callback(error,rows);
    });
}
const updateUser=(params,callback)=>{
    let query = "update user_info set user_name=? ,gender=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userName;
    paramsArray[i++] = params.gender;
    paramsArray[i++] = params.id;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateUser');
        callback(error,rows);
    });
}
const lastLoginOn=(params,callback)=>{
    let query = "update user_info set last_login_on = ? where wechat_id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.lastLoginOn;
    paramsArray[i++] = params.wechatId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('lastLoginOn');
        callback(error,rows);
    });
}
const updatePassword=(params,callback)=>{
    var query = "update user_info set password = ? where id = ? ";
    var paramsArray = [],i=0;
    paramsArray[i++] = params.newPassword;
    paramsArray[i++] = params.id;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updatePassword');
        callback(error,rows);
    });
}
const updatePhone=(params,callback)=>{
    var query = "update user_info set phone = ? where id = ? ";
    var paramsArray = [],i=0;
    paramsArray[i++] = params.phone;
    paramsArray[i++] = params.id;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updatePhone');
        callback(error,rows);
    });
}
const updateStatus=(params,callback)=>{
    var query = "update user_info set status = ? where id = ? ";
    var paramsArray =[],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i++] = params.id;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateStatus');
        callback(error,rows);
    });
}
module.exports = {
    queryUser,
    getUser,
    createUser,
    lastLoginOn,
    updateUser,
    updatePassword,
    updatePhone,
    updateStatus
}