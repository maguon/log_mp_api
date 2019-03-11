'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('CustomerPhoneDAO.js');
const db = require('../db/connection/MysqlDb.js');

const selectPhone = (params,callback) => {
    let query = " select id,phone from customer_service_phone " +
                " where 1=1";
    let paramsArray = [],i=0;
    if(params.id){
        paramsArray[i++] = params.id;
        query = query + " and id = ? "
    }
    if(params.phone){
        paramsArray[i] = params.phone;
        query = query + " and phone = ? "
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('selectPhone');
        callback(error,rows)
    })
}
const addPhone = (params,callback) => {
    let query = " insert into customer_service_phone(phone) values(?)";
    let paramsArray = [],i=0;
    paramsArray[i] = params.phone;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addPhone');
        callback(error,rows)
    })
}
const updatePhone = (params,callback) => {
    let query = " update customer_service_phone set phone = ? where id = ?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.phone;
    paramsArray[i] = params.id;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updatePhone');
        callback(error,rows)
    })
}
const deletePhone = (params,callback) => {
    let query = " delete from customer_service_phone where id = ?";
    let paramsArray = [],i=0;
    paramsArray[i] = params.id;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('deletePhone');
        callback(error,rows)
    })
}
module.exports = {
    selectPhone,
    addPhone,
    updatePhone,
    deletePhone
}