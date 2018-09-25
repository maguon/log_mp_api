'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('AdminUserDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const getAdminUser = (params,callback) => {
    let query = "select * from user_info where id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and is = ? ";
    }
    if(params.userName){
        paramsArray[i++] = params.userName;
        query = query + " and user_name = ? ";
    }
    if(params.phone){
        paramsArray[i++] = params.phone;
        query = query + " and phone = ? ";
    }
    if(params.wechatStatus){
        paramsArray[i++] = params.wechatStatus;
        query = query + " and wechat_status = ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart;
        query = query + " and created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd;
        query = query + " and created_on <= ? ";
    }
    if(params.authTimeStart){
        paramsArray[i++] = params.authTimeStart;
        query = query + " and auth_time >= ? ";
    }
    if(params.authTimeEnd){
        paramsArray[i++] = params.authTimeEnd;
        query = query + " and auth_time <= ? ";
    }
    if(params.authStatus){
        paramsArray[i++] = params.authStatus;
        query = query + " and auth_status = ? ";
    }
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query = query + " limit  ?, ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getAdminUser');
        callback(error,rows)
    })
}
const getAdminUserById = (params,callback) => {
    let query = "select user_name,id,wechat_status,auth_status,phone,auth_time,created_on,last_login_on from user_info where id is not null and id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getAdminUserById');
        callback(error,rows)
    })
}
const getAdminUserByIdInquiry = (params,callback) => {
    let query = " select im.*,cri.route_start,cri.route_end from inquiry_manage im " +
                " left join city_route_info cri on cri.route_id=im.route_id " +
                " left join city_info ci on ci.id=im.user_id " +
                " where im.user_id = ? ";
    let paramsArray = [],i=0;
        paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getAdminUserByIdInquiry');
        callback(error,rows)
    })
}
const getAdminUserIdRouteId = (params,callback) => {
    let query = "select im.*,cri.route_start,cri.route_end from inquiry_manage im " +
        "left join city_route_info cri on cri.route_id=im.route_id " +
        "left join city_info ci on ci.id=im.user_id " +
        "where im.user_id = ? and im.route_id = ?  ";
    let paramsArray = [],i=0;
        paramsArray[i++] = params.userId;
        paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getAdminUserIdRouteId');
        callback(error,rows)
    })
}
module.exports = {
    getAdminUser,
    getAdminUserById,
    getAdminUserByIdInquiry,
    getAdminUserIdRouteId
}