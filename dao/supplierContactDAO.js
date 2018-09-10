'use strict'
const wechatDAO = require('../dao/WechatDAO.js');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('SupplierContactDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addSupplierContact = (params,callback) => {
    let query = "insert into supplier_contact(supplier_id,name,position,phone) values(?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.supplierId;
    paramsArray[i++] = params.name;
    paramsArray[i++] = params.position;
    paramsArray[i] = params.phone;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addSupplierContact');
        callback(error,rows);
    })
}
const querySupplierContact = (params,callback) => {
    let query = "select sci.* from supplier_contact sci left join supplier_info si on si.id=sci.supplier_id where 1=1 ";
    let paramsArray = [],i=0;
    if(params.name){
        paramsArray[i++] = params.name;
        query = query + " and sci.name = ? ";
    }
    if(params.position){
        paramsArray[i++] = params.position;
        query = query + " and sci.position = ? ";
    }
    if(params.phone){
        paramsArray[i++] = params.phone;
        query = query + " and sci.phone = ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('querySupplierContact');
        callback(error,rows);
    })
}
const delSupplierContact = (params,callback) => {
    let query = "delete from supplier_contact where supplier_id = ? and id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.supplierId;
    paramsArray[i] = params.contactId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('delSupplierContact');
        callback(error,rows);
    })
}
module.exports = {
    addSupplierContact,
    querySupplierContact,
    delSupplierContact
}