'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('CompanyBankDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const add = (params,callback) =>{
    let query = "insert into company_bank(admin_id,bank,bank_code,account_name) values(?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.adminId;
    paramsArray[i++] = params.bank;
    paramsArray[i++] = params.bankCode;
    paramsArray[i] = params.accountName;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('add');
        callback(error,rows);
    })
}
const updateById = (params,callback) =>{
    let query = "update company_bank set id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.companyBankId;
    if (params.adminId){
        paramsArray[i++] = params.adminId;
        query += " , admin_id = ?"
    }
    if (params.bank){
        paramsArray[i++] = params.bank;
        query += " , bank = ?"
    }
    if (params.bankCode){
        paramsArray[i++] = params.bankCode;
        query += " , bank_code = ?"
    }
    if (params.accountName){
        paramsArray[i++] = params.accountName;
        query += " , account_name = ?"
    }
    if (params.status){
        paramsArray[i++] = params.status;
        query += " , status = ?"
    }
    paramsArray[i] = params.companyBankId;
    query += " where id = ?";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateById');
        callback(error,rows);
    })
}
const selectById = (params,callback) =>{
    let query = "select id,admin_id,bank,bank_code,account_name,status ,created_on,updated_on from company_bank where 1=1";
    let paramsArray = [],i=0;
    if (params.companyBankId){
        paramsArray[i++] = params.companyBankId;
        query += " and id = ?"
    }
    if (params.status){
        paramsArray[i] = params.status;
        query += " and status = ?"
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('selectById');
        callback(error,rows);
    })
}
module.exports = {
    add,updateById,selectById
}