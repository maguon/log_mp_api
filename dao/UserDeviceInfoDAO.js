'use strict'
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('UserDAO.js');
const db = require('../db/connection/MysqlDb.js');


const selectById = (params,callback) => {
    let query = "select * from user_device_info where id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and user_id = ? ";
    }
    if(params.brand){
        query = query + " and brand = ?";
    }
    if(params.model){
        paramsArray[i++] = params.model;
        query = query + " and model = ? "
    }
    if(params.system){
        paramsArray[i] = params.system;
        query = query + " and system = ? "
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('selectById');
        callback(error,rows);
    })
}
const add = (params,callback)=>{
    let query = "insert into user_device_info (user_id,brand,model,system) values(?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.brand;
    paramsArray[i++]=params.model;
    paramsArray[i]=params.system;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addUserDeviceInfo');
        callback(error,rows);
    });
}

module.exports = {
    selectById,
    add
}