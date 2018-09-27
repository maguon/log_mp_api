'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('InquiryDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const getAdminUserInfo = (params,callback) => {
    let query = "select * from user_info where id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and id = ? ";
    }
    if(params.wechatAccount){
        paramsArray[i++] = params.wechatAccount;
        query = query + " and wechat_account = ? ";
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
        logger.debug('getAdminUserInfo');
        callback(error,rows)
    })
}
const addRouteInquiry = (params,callback) => {
    let query = "insert into inquiry_info(user_id,route_id,service_type,model_id,old_car,phone,inquiry_name,plan,fee) values(?,?,?,?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.routeId;
    paramsArray[i++] = params.serviceType;
    paramsArray[i++] = params.modelId;
    paramsArray[i++] = params.oldCar;
    paramsArray[i++] = params.phone;
    paramsArray[i++] = params.inquiryName;
    paramsArray[i++] = params.plan;
    paramsArray[i] = params.fee;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addRouteInquiry');
        callback(error,rows);
    })
}
module.exports = {
    getAdminUserInfo,
    addRouteInquiry
}