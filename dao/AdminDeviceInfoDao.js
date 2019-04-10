'use strict';

const wechatDAO = require('../dao/WechatDAO.js');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('AdminDeviceInfoDao.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');
const encrypt = require('../util/Encrypt.js');

const getDeviceInfo = (params,callback) => {
    let query = "select * from admin_device_info where id is not null ";
    let paramsArray = [],i=0;
    if(params.adminId){
        paramsArray[i++] = params.adminId;
        query = query + " and admin_id = ? ";
    }
    if(params.deviceType){
        paramsArray[i++] = params.deviceType;
        query = query + " and device_type = ?";
    }
    if(params.deviceToken){
        paramsArray[i++] = params.deviceToken;
        query = query + " and device_token = ? "
    }
    if(params.appType){
        paramsArray[i++] = params.appType;
        query = query + " and app_type = ?";
    }
    if(params.appVersion){
        paramsArray[i++] = params.appVersion;
        query = query + " and app_version = ? "
    }
    if(params.status){
        paramsArray[i] = params.status;
        query = query + " and status = ? "
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('selectById');
        callback(error,rows);
    })
}
const updateDeviceInfo = (params,callback)=>{
    let query = " update admin_device_info set app_type = ? ,app_version = ? where id = ?";
    let paramsArray=[],i=0;
    paramsArray[i++] = params.appType;
    paramsArray[i++] = params.appVersion;
    paramsArray[i] = params.adminId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updateDeviceInfo ');
        return callback(error,rows);
    });
}

const addDeviceInfo = (params,callback)=>{
    let query = "insert into admin_device_info (admin_id,device_type,device_token,app_type,app_version,status) values(?,?,?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++]=params.adminId;
    paramsArray[i++]=params.deviceType;
    paramsArray[i++]=params.deviceToken;
    paramsArray[i++]=params.appType;
    paramsArray[i++]=params.appVersion;
    paramsArray[i]=params.status;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addAdminDeviceInfo');
        callback(error,rows);
    });
}

module.exports = {
    getDeviceInfo,
    updateDeviceInfo,
    addDeviceInfo,

}