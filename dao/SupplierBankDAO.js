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
    paramsArray[i] = params.accountName;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addSupplierBank');
        callback(error,rows);
    })
}
const querySupplierBank = (params,callback) => {
    let query = "select sb.* from supplier_bank sb left join supplier_info si on si.id=sb.supplier_id where sb.id is not null ";
    let paramsArray = [],i=0;
    if(params.supplierId){
        paramsArray[i++] = params.supplierId;
        query = query + " and sb.supplier_id = ? ";
    }
    if(params.bank){
        paramsArray[i++] = params.bank;
        query = query + " and sb.bank = ? ";
    }
    if(params.bankCode){
        paramsArray[i++] = params.bankCode;
        query = query + " and sb.bank_code = ? ";
    }
    if(params.accountName){
        paramsArray[i++] = params.accountName;
        query = query + " and sb.account_name = ? ";
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