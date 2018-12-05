'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('AddressDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const getAddress = (params,callback) => {
    let query = " select * from address_info where id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and user_id = ? "
    }
    if(params.addressId){
        paramsArray[i++] = params.addressId;
        query = query + " and id = ? "
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and status = ? "
    }
    if(params.type){
        paramsArray[i] = params.type;
        query = query + " and type = ? "
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getAddress');
        callback(error,rows)
    })
}
const addAddress = (params,callback) => {
    let query = " insert into address_info(user_id,name,phone,address,type,mark) values(?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.name;
    paramsArray[i++] = params.phone;
    paramsArray[i++] = params.address;
    paramsArray[i++] = params.type;
    paramsArray[i] = params.mark;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addAddress');
        callback(error,rows)
    })
}
const updateStatus = (params,callback) => {
    let query = " update address_info set status=? where id = ?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.addressId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateStatus');
        callback(error,rows)
    })
}
const updateAddress = (params,callback) => {
    let query = " update address_info set name=?,phone=?,address=?, mark=?,type=? where id = ?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.name;
    paramsArray[i++] = params.phone;
    paramsArray[i++] = params.address;
    paramsArray[i++] = params.mark;
    paramsArray[i++] = params.type;
    paramsArray[i] = params.addressId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateAddress');
        callback(error,rows)
    })
}
module.exports = {
    getAddress,
    addAddress,
    updateStatus,
    updateAddress
}