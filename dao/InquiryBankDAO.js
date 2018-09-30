'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('InquiryUserDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const getInquiryBankByInquiryId = (params,callback) => {
    let query = "select ub.bank,ub.bank_code,ub.account_name from inquiry_bank ub " +
        "left join user_info ui on ub.user_id=ui.id " +
        "where ui.id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getInquiryBankByInquiryId');
        callback(error,rows)
    })
}
module.exports = {
    getInquiryBankByInquiryId
}