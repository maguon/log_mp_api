'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('InquiryInvoiceDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const getInquiryInvoice = (params,callback) => {
    let query = " select uii.* from inquiry_invoice uii " +
                " left join user_info ui on uii.user_id=ui.id " +
                " where uii.id is not null ";
    let paramsArray = [],i=0;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getInquiryInvoice');
        callback(error,rows)
    })
}
const addInquiryInvoice = (params,callback) => {
    let query = " insert into inquiry_invoice(user_id,company_name,tax_number,company_address,bank,bank_code,company_phone) values(?,?,?,?,?,?,?)";
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
    let query = " update inquiry_invoice set status = ? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.inquiryInvoiceId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateInquiryInvoice');
        callback(error,rows)
    })
}
const updateInquiryInvoiceStatusByUserId = (params,callback) => {
    let query = " update inquiry_invoice set status = 0 where user_id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateInquiryInvoiceStatusByUserId');
        callback(error,rows)
    })
}
module.exports = {
    getInquiryInvoice,
    addInquiryInvoice,
    updateInquiryInvoiceStatusByUserId,
    updateInquiryInvoiceStatus
}