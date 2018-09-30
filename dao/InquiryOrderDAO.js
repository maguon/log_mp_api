'use strict';

const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('InquiryOrderDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const getInquiryOrderByInquiryId = (params,callback) => {
    let query = "select uo.* from inquiry_info ii " +
                "left join user_info ui on ui.id=ii.user_id " +
                "left join inquiry_order uo on uo.inquiry_id = ii.id " +
                "where  1=1 ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and ii.user_id = ?"
    }
    if(params.inquiryId){
        paramsArray[i++] = params.inquiryId;
        query = query + " and ii.id = ?"
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getInquiryOrderByInquiryId');
        callback(error,rows)
    })
}
const addInquiryOrder = (params,callback) => {
    let query = "insert into inquiry_order(inquiry_id,fee_price,freight_price,mark) values(?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.inquiryId;
    paramsArray[i++] = params.feePrice;
    paramsArray[i++] = params.freightPrice;
    paramsArray[i] = params.mark;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addInquiryOrder');
        callback(error,rows);
    })
}
module.exports = {
    getInquiryOrderByInquiryId,
    addInquiryOrder
}