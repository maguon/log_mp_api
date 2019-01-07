'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('InquiryBankDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const getInquiryBank = (params,callback) => {
    let query = " select ub.* from user_bank ub " +
                " left join user_info ui on ub.user_id=ui.id " +
                " where ub.id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and ub.user_id = ? ";
    }
    if(params.inquiryBankId){
        paramsArray[i++] = params.inquiryBankId;
        query = query + " and ub.id = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and ub.status = ? ";
    }
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?, ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getInquiryBank');
        callback(error,rows)
    })
}
const addInquiryBank = (params,callback) => {
    let query = " insert into user_bank(user_id,bank,bank_code,account_name) values(?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.bank;
    paramsArray[i++] = params.bankCode;
    paramsArray[i] = params.accountName;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addInquiryBank');
        callback(error,rows)
    })
}
const updateInquiryBank = (params,callback) => {
    let query = " update user_bank set status = ? where id = ?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.inquiryBankId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateInquiryBank');
        callback(error,rows)
    })
}
const updateInquiryBankStatus = (params,callback) => {
    let query = " update user_bank set status = 0 where user_id = ?";
    let paramsArray = [],i=0;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateInquiryBankStatus');
        callback(error,rows)
    })
}
const deleteById = (params,callback) => {
    let query = " delete from user_bank where user_id = ? and id = ?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i] = params.userBankId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('deleteById');
        callback(error,rows)
    })
}
module.exports = {
    getInquiryBank,
    addInquiryBank,
    updateInquiryBank,
    updateInquiryBankStatus,
    deleteById
}