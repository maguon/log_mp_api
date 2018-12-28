'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('UserAddressDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addAddress = (params,callback) => {
    let query = " insert into user_address(user_id,address,detail_address,user_name,phone,type) values(?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.address;
    paramsArray[i++] = params.detailAddress;
    paramsArray[i++] = params.userName;
    paramsArray[i++] = params.phone;
    paramsArray[i] = params.type;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addAddress');
        callback(error,rows)
    })
}
const getAddress = (params,callback) => {
    let query = " select * from user_address where id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        query = query + " and user_id = ? ";
        paramsArray[i++] = params.userId;
    }
    if(params.addressId){
        query = query + " and id = ? ";
        paramsArray[i++] = params.addressId;
    }
    if(params.type){
        query = query + " and type = ? ";
        paramsArray[i] = params.type;
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getAddress');
        callback(error,rows)
    })
}
const updateStatus = (params,callback) => {
    let query = " update user_address set status = ? where id = ?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.addressId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateStatus');
        callback(error,rows)
    })
}
const updateAddress = (params,callback) => {
    let query = " update user_address set address = ?,detail_address = ?,user_name = ?,phone = ?,type = ? where id = ?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.address;
    paramsArray[i++] = params.detailAddress;
    paramsArray[i++] = params.userName;
    paramsArray[i++] = params.phone;
    paramsArray[i++] = params.type;
    paramsArray[i] = params.addressId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateAddress');
        callback(error,rows)
    })
}
const delAddress = (params,callback) => {
    let query = " delete from user_address where id = ?";
    let paramsArray = [],i=0;
    paramsArray[i] = params.addressId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('delAddress');
        callback(error,rows)
    })
}
module.exports = {
    addAddress,
    getAddress,
    updateStatus,
    updateAddress,
    delAddress
}