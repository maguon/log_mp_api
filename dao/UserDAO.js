'use strict'
const wechatDAO = require('../dao/WechatDAO.js');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('UserDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');
const encrypt = require('../util/Encrypt.js');

const queryUser = (params,callback) => {
    let query = "select * from user_info where id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and id = ? ";
    }
    if(params.userName){
        query = query + " and user_name like '%"+params.userName+"%'";
    }
    if(params.phone){
        paramsArray[i++] = params.phone;
        query = query + " and phone = ? "
    }
    if(params.wechatName){
        paramsArray[i++] = params.wechatName;
        query = query + " and wechat_name = ? "
    }
    if(params.wechatId){
        paramsArray[i++] = params.wechatId;
        query = query + " and wechat_id = ? "
    }
    if(params.wechatStatus){
        paramsArray[i++] = params.wechatStatus;
        query = query + " and wechat_status = ? "
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart +' 00:00:00';
        query = query + " and created_on >= ? "
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd + ' 23:59:59';
        query = query + " and created_on <= ? "
    }
    if(params.authStartTime){
        paramsArray[i++] = params.authStartTime+' 00:00:00';
        query = query + " and auth_time >= ? "
    }
    if(params.authEndTime){
        paramsArray[i++] = params.authEndTime+ ' 23:59:59';
        query = query + " and auth_time >= ? "
    }
    if(params.authStatus){
        paramsArray[i++] = params.authStatus;
        query = query + " and auth_status = ? "
    }
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ? , ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('queryUser');
        callback(error,rows);
    })
}
const createUser = (params,callback)=>{
    let query = "insert into user_info (user_name,wechat_name,wechat_id,gender,avatar) values(?,?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++]=params.wechatName;
    paramsArray[i++]=params.wechatName;
    paramsArray[i++]=params.wechatId;
    paramsArray[i++]=params.gender;
    paramsArray[i]=params.avatar;
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
    let query = "update user_info set password = ? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.newPassword;
    paramsArray[i++] = params.id;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updatePassword');
        callback(error,rows);
    });
};
const updatePhone=(params,callback)=>{
    let query = "update user_info set phone = ? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.phone;
    paramsArray[i++] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updatePhone');
        callback(error,rows);
    });
}
const updateStatus=(params,callback)=>{
    let query = "update user_info set wechat_status = ? where id = ? ";
    let paramsArray =[],i=0;
    paramsArray[i++] = params.wechatStatus;
    paramsArray[i++] = params.id;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateStatus');
        callback(error,rows);
    });
}
const updateUserInfo=(params,callback)=>{
    let query = "update user_info set user_name = ?,gender=?,birth=? where id = ? ";
    let paramsArray =[],i=0;
    paramsArray[i++] = params.userName;
    paramsArray[i++] = params.gender;
    paramsArray[i++] = params.birth;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateUserInfo');
        callback(error,rows);
    });
}
const updateAuthStatus=(params,callback)=>{
    let query = "update user_info set auth_status = ?,auth_time=? where id = ? ";
    let paramsArray =[],i=0;
    paramsArray[i++] = params.authStatus;
    paramsArray[i++] = params.authTime;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateAuthStatus');
        callback(error,rows);
    });
}
module.exports = {
    queryUser,
    createUser,
    lastLoginOn,
    updateUser,
    updatePassword,
    updatePhone,
    updateStatus,
    updateUserInfo,
    updateAuthStatus
}