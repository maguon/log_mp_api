'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('InquiryContactDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const getInquiryContactByInquiryId = (params,callback) => {
    let query = "select c.name,c.phone,c.city,c.address from inquiry_contact c " +
                "left join user_info ui on c.user_id=ui.id " +
                "where ui.id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getInquiryContactByInquiryId');
        callback(error,rows)
    })
}
module.exports = {
    getInquiryContactByInquiryId
}