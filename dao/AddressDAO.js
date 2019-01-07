'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('AddressDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const getAddress = (params,callback) => {
    let query = " select ci.id as city_id,ci.city_name,ai.* from address_info ai " +
                " left join city_info ci on ci.id=ai.city " +
                " where ai.id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and ai.user_id = ? "
    }
    if(params.addressId){
        paramsArray[i++] = params.addressId;
        query = query + " and ai.id = ? "
    }
    if(params.city){
        paramsArray[i++] = params.city;
        query = query + " and ai.city = ? "
    }
    if(params.name){
        paramsArray[i++] = params.name;
        query = query + " and ai.name = ? "
    }
    if(params.userName){
        paramsArray[i++] = params.userName;
        query = query + " and ui.userName = ? "
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and ai.status = ? "
    }
    if(params.type){
        paramsArray[i] = params.type;
        query = query + " and ai.type = ? "
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getAddress');
        callback(error,rows)
    })
}
const addAddress = (params,callback) => {
    let query = " insert into address_info(city,name,address,remark,lon,lat) values(?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.city;
    paramsArray[i++] = params.name;
    paramsArray[i++] = params.address;
    paramsArray[i++] = params.mark;
    paramsArray[i++] = params.lon;
    paramsArray[i] = params.lat;
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
    let query = " update address_info set city=?,name=?,phone=?,address=?, remark=?,type=? where id = ?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.city;
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
const updateAddressByAdmin = (params,callback) => {
    let query = " update address_info set city=?,name=?,address=?, lon=?,lat=?,remark=? where id = ?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.city;
    paramsArray[i++] = params.name;
    paramsArray[i++] = params.address;
    paramsArray[i++] = params.lon;
    paramsArray[i++] = params.lat;
    paramsArray[i++] = params.mark;
    paramsArray[i] = params.addressId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateAddressByAdmin');
        callback(error,rows)
    })
}
module.exports = {
    getAddress,
    addAddress,
    updateStatus,
    updateAddress,
    updateAddressByAdmin
}