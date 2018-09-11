'use strict'
const wechatDAO = require('../dao/WechatDAO.js');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('SupplierBankDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addSupplierBank = (params,callback) => {
    let query = "insert into supplier_bank(supplier_id,bank,bank_code,account_name) values(?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.supplierId;
    paramsArray[i++] = params.bank;
    paramsArray[i++] = params.bankCode;
    paramsArray[i] = params.name;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addSupplierBank');
        callback(error,rows);
    })
}
const querySupplierBank = (params,callback) => {
    let query = "select sbi.* from supplier_bank sbi left join supplier_info si on si.id=sbi.supplier_id where sbi.id is not null ";
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
module.exports = {
    addSupplierBank,
    querySupplierBank,
    delSupplierBank
}