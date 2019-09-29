'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('AddressContactDAO.js');
const db = require('../db/connection/MysqlDb.js');

const getAddressContact = (params,callback) => {
    let query = " select * from address_contact where id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and user_id = ? "
    }
    if(params.addressId){
        paramsArray[i++] = params.addressId;
        query = query + " and address_id = ? "
    }
    if(params.addressContactId){
        paramsArray[i++] = params.addressContactId;
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
        logger.debug('getAddressContact');
        callback(error,rows)
    })
}
const addAddressContact = (params,callback) => {
    let query = " insert into address_contact(address_id,user_name,phone,position) values(?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.addressId;
    paramsArray[i++] = params.userName;
    paramsArray[i++] = params.phone;
    paramsArray[i] = params.position;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addAddressContact');
        callback(error,rows)
    })
}
const delAddressContact = (params,callback) => {
    let query = " delete from address_contact where id=?";
    let paramsArray = [],i=0;
    paramsArray[i] = params.addressContactId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('delAddressContact');
        callback(error,rows)
    })
}
module.exports = {
    getAddressContact,
    addAddressContact,
    delAddressContact
}