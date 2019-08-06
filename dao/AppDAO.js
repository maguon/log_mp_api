'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('AppDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');
const encrypt = require('../util/Encrypt.js');

const getApp = (params,callback) => {
    let query = "select * from app where id is not null ";
    let paramsArray = [],i=0;
    if(params.appId){
        paramsArray[i++] = params.appId;
        query = query + " and id = ? ";
    }
    if(params.appType){
        paramsArray[i++] = params.appType;
        query = query + " and app_type = ? ";
    }
    if(params.deviceType){
        paramsArray[i++] = params.deviceType;
        query = query + " and device_type = ?";
    }
    if(params.version){
        paramsArray[i++] = params.version;
        query = query + " and version = ? "
    }
    if(params.versionNum){
        paramsArray[i++] = params.versionNum;
        query = query + " and version_num = ?";
    }
    if(params.minYersionNum){
        paramsArray[i++] = params.minYersionNum;
        query = query + " and min_version_num = ? "
    }
    if(params.forceUpdate){
        paramsArray[i] = params.forceUpdate;
        query = query + " and force_update = ? "
    }
    if(params.url){
        paramsArray[i] = params.url;
        query = query + " and url = ? "
    }
    if(params.remarks){
        paramsArray[i] = params.remarks;
        query = query + " and Remarks = ? "
    }
    if(params.status){
        paramsArray[i] = params.status;
        query = query + " and status = ? "
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getApp');
        callback(error,rows);
    })
}
const updateApp = (params,callback)=>{
    let query = " update app set app_type = ? , device_type = ?, version = ? ,version_num = ?,min_version_num = ?,force_update = ?,url = ?,Remarks = ?,status = ? where id = ?";
    let paramsArray=[],i=0;
    paramsArray[i++] = params.appType;
    paramsArray[i++] = params.deviceType;
    paramsArray[i++] = params.version;
    paramsArray[i++] = params.versionNum;
    paramsArray[i++] = params.minVersionNum;
    paramsArray[i++] = params.forceUpdate;
    paramsArray[i++] = params.url;
    paramsArray[i++] = params.remarks;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.appId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updateApp ');
        return callback(error,rows);
    });
}

const addApp = (params,callback)=>{
    let query = "insert into app (app_type,device_type,version,version_num,min_version_num,force_update,url,Remarks,status) values(?,?,?,?,?,?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++]=params.appType;
    paramsArray[i++]=params.deviceType;
    paramsArray[i++]=params.version;
    paramsArray[i++]=params.versionNum;
    paramsArray[i++]=params.minVersionNum;
    paramsArray[i++]=params.forceUpdate;
    paramsArray[i++]=params.url;
    paramsArray[i++]=params.remarks;
    paramsArray[i]=params.status;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addApp');
        callback(error,rows);
    });
}

module.exports = {
    getApp,
    updateApp,
    addApp
}