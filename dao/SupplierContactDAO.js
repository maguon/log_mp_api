'use strict'
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('SupplierContactDAO.js');
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
    let query = "select sc.* from supplier_contact sc left join supplier_info si on si.id=sc.supplier_id where 1=1 ";
    let paramsArray = [],i=0;
    if(params.supplierId){
        paramsArray[i++] = params.supplierId;
        query = query + " and sc.supplier_id = ? ";
    }
    if(params.name){
        paramsArray[i++] = params.name;
        query = query + " and sc.name = ? ";
    }
    if(params.position){
        paramsArray[i++] = params.position;
        query = query + " and sc.position = ? ";
    }
    if(params.phone){
        paramsArray[i++] = params.phone;
        query = query + " and sc.phone = ? ";
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