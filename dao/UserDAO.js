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
    var query = "select * from user_info where id is not null ";
    var paramsArray = [],i=0;
    if(params.id){
        paramsArray[i++] = params.id;
        query = query + " and id = ? ";
    }
    if(params.wechatAccount){
        paramsArray[i++] = params.wechatAccount;
        query = query + " and wechat_account = ? ";
    }
    if(params.userName){
        query = query + " and user_name like '%"+params.userName+"%'";
    }
    if(params.phone){
        paramsArray[i++] = params.phone;
        query = query + " and password = ? "
    }
    if(params.wechatStatus){
        paramsArray[i++] = params.wechatStatus;
        query = query + " and wechat_status = ? "
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart;
        query = query + " and created_on >= ? "
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd;
        query = query + " and created_on <= ? "
    }
    if(params.authStartTime){
        paramsArray[i++] = params.authStartTime;
        query = query + " and auth_time >= ? "
    }
    if(params.authEndTime){
        paramsArray[i++] = params.authEndTime;
        query = query + " and auth_time >= ? "
    }
    if(params.authStatus){
        paramsArray[i++] = params.authStatus;
        query = query + " and auth_status = ? "
    }
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query = query + " limit ? , ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('queryUser');
        callback(error,rows);
    })
}
const createUser = (params,callback)=>{
    var query = "insert into user_info (user_name,wechat_account,wechat_id,password,gender,phone,avatar,wechat_status,auth_status) values(?,?,?,?,?,?,?,?,?) ";
    var paramsArray = [],i=0;
    paramsArray[i++]=params.userName;
    paramsArray[i++]=params.wechatAccount;
    paramsArray[i++]=params.wechatId;
    paramsArray[i++]=params.password;
    paramsArray[i++]=params.gender;
    paramsArray[i++]=params.phone;
    paramsArray[i++]=params.avatar;
    paramsArray[i++]=params.wechatStatus;
    paramsArray[i]=params.authStatus;
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
};
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
    var query = "update user_info set wechat_status = ? where id = ? ";
    var paramsArray =[],i=0;
    paramsArray[i++] = params.wechatStatus;
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