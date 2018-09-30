'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('InquiryInvoiceDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const getInquiryInvoiceByInquiryId = (params,callback) => {
    let query = "select uii.company_name,uii.tax_number,uii.company_address,uii.bank,uii.bank_code,uii.company_phone from inquiry_invoice uii " +
        "left join user_info ui on uii.user_id=ui.id " +
        "where ui.id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getInquiryInvoiceByInquiryId');
        callback(error,rows)
    })
}
module.exports = {
    getInquiryInvoiceByInquiryId
}