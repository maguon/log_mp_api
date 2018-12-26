'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('UserAddressDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addAddress = (params,callback) => {
    let query = " insert into address_info(address,detail_address,user_name,phone,type) values(?,?,?,?,?)";
    let paramsArray = [],i=0;
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
        paramsArray[i] = params.addressId;
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getAddress');
        callback(error,rows)
    })
}
module.exports = {
    addAddress,
    getAddress
}