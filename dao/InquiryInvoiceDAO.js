'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('InquiryInvoiceDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const getInquiryInvoice = (params,callback) => {
    let query = " select ui.user_name,uii.* from user_invoice uii " +
                " left join user_info ui on uii.user_id=ui.id " +
                " where uii.id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and uii.user_id = ?";
    }
    if(params.inquiryInvoiceId){
        paramsArray[i++] = params.inquiryInvoiceId;
        query = query + " and uii.id = ?";
    }
    if(params.companyName){
        paramsArray[i++] = params.companyName;
        query = query + " and uii.company_name = ?";
    }
    if(params.taxNumber){
        paramsArray[i++] = params.taxNumber;
        query = query + " and uii.tax_number = ?";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and uii.status = ?";
    }
    if(params.userName){
        paramsArray[i++] = params.userName;
        query = query + " and ui.user_name = ?";
    }
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?, ?";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getInquiryInvoice');
        callback(error,rows)
    })
}
const addInquiryInvoice = (params,callback) => {
    let query = " insert into user_invoice(user_id,company_name,tax_number,company_address,bank,bank_code,company_phone) values(?,?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.companyName;
    paramsArray[i++] = params.taxNumber;
    paramsArray[i++] = params.companyAddress;
    paramsArray[i++] = params.bank;
    paramsArray[i++] = params.bankCode;
    paramsArray[i] = params.companyPhone;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addInquiryInvoice');
        callback(error,rows)
    })
}
const updateInquiryInvoiceStatus = (params,callback) => {
    let query = " update user_invoice set status = ? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.userInvoiceId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateInquiryInvoice');
        callback(error,rows)
    })
}
const updateInquiryInvoiceStatusByUserId = (params,callback) => {
    let query = " update user_invoice set status = ? where user_id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateInquiryInvoiceStatusByUserId');
        callback(error,rows)
    })
}
const deleteById = (params,callback) => {
    let query = " delete from user_invoice where 1=1 and id= ?" ;
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userInvoiceId;
    if(params.userId){
        paramsArray[i] = params.userId;
        query = query + " and user_id = ?";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('deleteUserInvoiceById');
        callback(error,rows)
    })
}
const updateById = (params,callback) => {
    let query = " update user_invoice set id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userInvoiceId;
    if (params.title){
        paramsArray[i++] = params.title;
        query += " ,company_name = ? ";
    }
    if (params.taxNumber){
        paramsArray[i++] = params.taxNumber;
        query += " ,tax_number = ? ";
    }
    if (params.companyAddress){
        paramsArray[i++] = params.companyAddress;
        query += " ,company_address = ? ";
    }
    if (params.bank){
        paramsArray[i++] = params.bank;
        query += " ,bank = ? ";
    }
    if (params.bankCode){
        paramsArray[i++] = params.bankCode;
        query += " ,bank_code = ? ";
    }
    if (params.companyPhone){
        paramsArray[i++] = params.companyPhone;
        query += " ,company_phone = ? ";
    }
    query += " where id = ? ";
    paramsArray[i] = params.userInvoiceId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateUserInvoiceById');
        callback(error,rows)
    })
}
module.exports = {
    getInquiryInvoice,
    addInquiryInvoice,
    updateInquiryInvoiceStatusByUserId,
    updateInquiryInvoiceStatus,
    deleteById,
    updateById
}