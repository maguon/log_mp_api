'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('InquiryUserDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const getInquiryCarByInquiryId = (params,callback) => {
    let query = "select uc.model_id,uc.old_car,uc.plan,uc.fee,uc.car_num,uc.plan*uc.car_num as plan_sum,uc.car_num*uc.fee as fee_sum from inquiry_info ii " +
                "left join user_info ui on ui.id=ii.user_id " +
                "left join inquiry_car uc on uc.inquiry_id = ii.id " +
                "where ii.user_id = ? and ii.id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i] = params.inquiryId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getInquiryCarByInquiryId');
        callback(error,rows)
    })
}
module.exports = {
    getInquiryCarByInquiryId
}