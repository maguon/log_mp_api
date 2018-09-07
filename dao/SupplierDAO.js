'use strict'
const wechatDAO = require('../dao/WechatDAO.js');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('SupplierDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addSupplier = (params,callback) => {
    let query = "insert into supplier_info(supplier_abb,supplier_name,mark) values(?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.supplierAbb;
    paramsArray[i++] = params.supplierName;
    paramsArray[i] = params.mark;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addSupplier');
        callback(error,rows);
    })
}
const querySupplier = (params,callback) => {
    let query = "select * from supplier_info where 1=1";
    let paramsArray = [],i=0;
    if(params.supplierId){
        paramsArray[i++] = params.supplierId;
        query = query + " and id = ? ";
    }
    if(params.supplierAdd){
        paramsArray[i++] = params.supplierAdd;
        query = query + " and supplier_add = ? ";
    }
    if(params.supplierName){
        paramsArray[i++] = params.supplierName;
        query = query + " and supplier_name = ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('querySupplier');
        callback(error,rows);
    })
}
const addSupplierBank = (params,callback) => {
    let query = "insert into supplier_bank(supplier_id,bank,bank_code,name) values(?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.supplierId;
    paramsArray[i++] = params.bank;
    paramsArray[i++] = params.bankcCode;
    paramsArray[i] = params.name;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        loger.debug('addSupplierBank');
        callback(error,rows);
    })
}
const querySupplierBank = (params,callback) => {
    let query = "select sbi.* from supplier_bank sbi left join supplier_info si on si.id=sbi.supplier_id where 1=1 ";
    let paramsArray = [],i=0;
    if(params.bank){
        paramsArray[i++] = params.bank;
        query = query + " and sbi.bank = ? ";
    }
    if(params.bankCode){
        paramsArray[i++] = params.bankCode;
        query = query + " and sbi.bank_code = ? ";
    }
    if(params.name){
        paramsArray[i++] = params.name;
        query = query + " and sbi.name = ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('querySupplierBank');
        callback(error,rows);
    })
}
const delSupplierBank = (params,callback) => {
    let query = "delete from supplier_bank where supplier_id = ? and id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.supplierId;
    paramsArray[i] = params.bankId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('delSupplierBank');
        callback(error,rows);
    })
}
const addSupplierContact = (params,callback) => {
    let query = "insert into supplier_contact(supplier_id,name,position,phone) values(?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.supplierId;
    paramsArray[i++] = params.name;
    paramsArray[i++] = params.position;
    paramsArray[i] = params.phone;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        loger.debug('addSupplierContact');
        callback(error,rows);
    })
}
const querySupplierContact = (params,callback) => {
    let query = "select sbi.* from supplier_contact sci left join supplier_info si on si.id=sci.supplier_id where 1=1 ";
    let paramsArray = [],i=0;
    if(params.bank){
        paramsArray[i++] = params.bank;
        query = query + " and sci.name = ? ";
    }
    if(params.bankCode){
        paramsArray[i++] = params.bankCode;
        query = query + " and sci.position = ? ";
    }
    if(params.name){
        paramsArray[i++] = params.name;
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
    addSupplier,
    querySupplier,
    addSupplierBank,
    querySupplierBank,
    delSupplierBank,
    addSupplierContact,
    querySupplierContact,
    delSupplierContact
}