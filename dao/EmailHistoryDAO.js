'use strict'
const wechatDAO = require('../dao/WechatDAO.js');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('UserDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addMailRecord = (params,callback)=>{
    let query = "insert into email_history (email,type,status) values(?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.email;
    paramsArray[i++] = params.type;
    paramsArray[i] = params.status;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addMailRecord');
        callback(error,rows);
    });
};
const queryMailRecord = (params,callback) =>{
    let query = "select user,created_on,type from email_history where id is not null ";
    let paramsArray = [],i=0;
    if(params.id){
        paramsArray[i++] = params.id;
        query = query + " and id = ? ";
    }
    if(params.email){
        paramsArray[i++] = params.email;
        query = query + " and email = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and  status = ? ";
    }
    if(params.type){
        paramsArray[i++] = params.type;
        query = query + " and  type = ? ";
    }
    if(params.accountConfirmEmailStart){
        paramsArray[i++] = params.accountConfirmEmailStart + " 00:00:00 ";
        query = query + " and created_on >= ? ";
    }
    if(params.accountConfirmEmailEnd){
        paramsArray[i++] = params.accountConfirmEmailEnd + " 23:59:59 ";
        query = query + " and created_on <= ? ";
    }
    if(params.start && params.size){
        paramsArray[i++] = params.start;
        query = query + " limit ? , ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('queryMailRecord');
        callback(error,rows);
    });
};
module.exports = {
    addMailRecord,
    queryMailRecord
};